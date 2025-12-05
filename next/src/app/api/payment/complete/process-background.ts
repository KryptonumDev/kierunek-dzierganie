import { NotificationRequest } from '@ingameltd/node-przelewy24';
import { GAConversionPurchase } from './GAConversionPurchase';
import { generateBill } from './generate-bill';
import { MetaConversionPurchase } from './MetaConversionPurchase';
import { sendEmails } from './send-emails';
import { sendPaymentErrorNotification } from './send-error-notification';
import { updateItemsQuantity } from './update-items-quantity';
import { updateOrder } from './update-order';
import { verifyTransaction } from './verify-transaction';

interface OrderData {
  user_id: string | null;
  guest_email: string | null;
  amount: number;
  need_delivery: boolean;
  billing: {
    email: string;
  };
  products: {
    array: Array<{
      id: string;
      name: string;
      quantity: number;
      discount: number;
      price: number;
    }>;
  };
}

interface BackgroundProcessingParams {
  orderId: string;
  orderData: OrderData;
  notificationData: NotificationRequest;
  expectedAmount: number;
}

/**
 * Background processing for payment completion.
 * This runs AFTER the webhook has returned 200 to P24.
 * 
 * Operations:
 * 1. Verify transaction with P24 (confirms funds transfer)
 * 2. Update item quantities (stock)
 * 3. Generate invoice (iFirma)
 * 4. Send confirmation emails
 * 5. Track analytics (GA + Meta)
 */
export async function processBackground({
  orderId,
  orderData,
  notificationData,
  expectedAmount,
}: BackgroundProcessingParams): Promise<void> {
  const bgStart = Date.now();
  const { sessionId, amount, currency, orderId: p24OrderId } = notificationData;

  // 1. Verify transaction with P24
  try {
    await verifyTransaction(expectedAmount, currency, p24OrderId, sessionId);
  } catch (verifyError) {
    const errorMessage = verifyError instanceof Error ? verifyError.message : 'Unknown verification error';
    const errorStack = verifyError instanceof Error ? verifyError.stack : undefined;
    
    console.error('❌ [BACKGROUND] P24 transaction verification failed:', verifyError);
    
    await sendPaymentErrorNotification({
      orderId,
      sessionId,
      amount: expectedAmount,
      currency,
      p24OrderId,
      errorType: 'VERIFICATION_ERROR',
      errorMessage: `P24 transaction verification failed (background): ${errorMessage}`,
      errorStack,
      timestamp: new Date().toISOString(),
    });
    
    // Continue with other processing - customer already paid
    // Manual intervention needed to verify with P24
  }

  // 2. Update item quantities (stock)
  try {
    await updateItemsQuantity(orderData);
  } catch (stockError) {
    const errorMessage = stockError instanceof Error ? stockError.message : 'Unknown stock update error';
    const errorStack = stockError instanceof Error ? stockError.stack : undefined;
    
    console.error('❌ [BACKGROUND] Failed to update item quantities:', stockError);
    
    await sendPaymentErrorNotification({
      orderId,
      sessionId,
      amount: expectedAmount,
      currency,
      p24OrderId,
      errorType: 'PROCESSING_ERROR',
      errorMessage: `Failed to update stock quantities: ${errorMessage}`,
      errorStack,
      timestamp: new Date().toISOString(),
    });
    // Continue - customer already paid
  }

  // 3. Generate invoice
  try {
    await generateBill(orderData, orderId);
  } catch (billError) {
    const errorMessage = billError instanceof Error ? billError.message : 'Unknown invoice error';
    const errorStack = billError instanceof Error ? billError.stack : undefined;
    
    console.error('❌ [BACKGROUND] Invoice generation failed:', billError);
    
    await sendPaymentErrorNotification({
      orderId,
      sessionId,
      amount: expectedAmount,
      currency,
      p24OrderId,
      errorType: 'PROCESSING_ERROR',
      errorMessage: `Invoice generation failed: ${errorMessage}`,
      errorStack,
      timestamp: new Date().toISOString(),
    });
    
    // Fallback: mark digital orders as COMPLETED (3); keep physical orders as IN PROGRESS (2)
    try {
      await updateOrder(
        { status: orderData.need_delivery ? 2 : 3 },
        orderId
      );
    } catch (statusError) {
      console.error('❌ [BACKGROUND] Failed to set fallback status after invoice error:', statusError);
    }
  }

  // 4. Send confirmation emails
  try {
    await sendEmails(orderData);
  } catch (emailError) {
    console.error('❌ [BACKGROUND] Failed to send emails:', emailError);
  }

  // 5. Analytics tracking (GA + Meta)
  try {
    await GAConversionPurchase({
      user_id: orderData.user_id || null,
      value: amount / 100,
      transaction_id: String(p24OrderId),
      items: orderData.products.array.map(({ id, name, quantity, discount, price }) => ({
        item_id: id,
        item_name: name,
        quantity: quantity,
        price: discount ? discount / 100 : price / 100,
      })),
    });
  } catch (gaError) {
    console.error('❌ [BACKGROUND] GA tracking failed:', gaError);
  }

  try {
    await MetaConversionPurchase({
      user_id: orderData.user_id || null,
      value: amount / 100,
      transaction_id: String(p24OrderId),
      items: orderData.products.array.map(({ id, name, quantity, discount, price }) => ({
        item_id: id,
        item_name: name,
        quantity: quantity,
        price: discount ? discount / 100 : price / 100,
      })),
      email: orderData.billing.email,
    });
  } catch (metaError) {
    console.error('❌ [BACKGROUND] Meta tracking failed:', metaError);
  }

  const bgDuration = Date.now() - bgStart;
  console.log(`⏱️ [BACKGROUND] Order ${orderId} completed in ${bgDuration}ms`);
}

