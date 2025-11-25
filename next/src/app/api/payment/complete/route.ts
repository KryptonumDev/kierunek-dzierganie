'use server';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-admin';
import { P24, NotificationRequest } from '@ingameltd/node-przelewy24';
import { checkUsedModifications } from './check-used-modifications';
import { GAConversionPurchase } from './GAConversionPurchase';
import { generateBill } from './generate-bill';
import { MetaConversionPurchase } from './MetaConversionPurchase';
import { sendEmails } from './send-emails';
import { sendPaymentErrorNotification } from './send-error-notification';
import { updateItemsQuantity } from './update-items-quantity';
import { updateOrder } from './update-order';
import { verifyTransaction } from './verify-transaction';

/**
 * Parse webhook body - handles both JSON and form-urlencoded formats
 * P24 can send webhooks in either format depending on configuration
 */
async function parseWebhookBody(request: Request): Promise<NotificationRequest | null> {
  const contentType = request.headers.get('content-type') || '';
  
  try {
    if (contentType.includes('application/json')) {
      return await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      return {
        merchantId: Number(params.get('merchantId')),
        posId: Number(params.get('posId')),
        sessionId: params.get('sessionId') || '',
        amount: Number(params.get('amount')),
        originAmount: Number(params.get('originAmount')),
        currency: params.get('currency') || 'PLN',
        orderId: Number(params.get('orderId')),
        methodId: Number(params.get('methodId')),
        statement: params.get('statement') || '',
        sign: params.get('sign') || '',
      };
    } else {
      // Try JSON first, then form-urlencoded as fallback
      const clonedRequest = request.clone();
      try {
        return await request.json();
      } catch {
        const text = await clonedRequest.text();
        const params = new URLSearchParams(text);
        if (params.get('sessionId')) {
          return {
            merchantId: Number(params.get('merchantId')),
            posId: Number(params.get('posId')),
            sessionId: params.get('sessionId') || '',
            amount: Number(params.get('amount')),
            originAmount: Number(params.get('originAmount')),
            currency: params.get('currency') || 'PLN',
            orderId: Number(params.get('orderId')),
            methodId: Number(params.get('methodId')),
            statement: params.get('statement') || '',
            sign: params.get('sign') || '',
          };
        }
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Failed to parse webhook body:', error);
    return null;
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const webhookContentType = request.headers.get('content-type');
  
  // Log incoming webhook for debugging
  console.log('🔔 P24 Webhook received:', {
    timestamp: new Date().toISOString(),
    orderId: id,
    contentType: webhookContentType,
  });

  // Store notification data for error reporting (populated after parsing)
  let notificationData: NotificationRequest | null = null;

  try {
    // Parse webhook body (supports both JSON and form-urlencoded)
    notificationData = await parseWebhookBody(request);
    
    if (!notificationData) {
      console.error('❌ Failed to parse P24 notification body', { orderId: id });
      
      // Send error notification
      await sendPaymentErrorNotification({
        orderId: id,
        errorType: 'PARSE_ERROR',
        errorMessage: 'Failed to parse P24 webhook notification body',
        webhookContentType,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json({ error: 'Invalid notification format' }, { status: 400 });
    }

    // Extract fields from notification
    const { sessionId, amount, currency, orderId } = notificationData;
    
    console.log('📦 P24 Notification data:', {
      sessionId,
      amount,
      currency,
      orderId,
      merchantId: notificationData.merchantId,
      methodId: notificationData.methodId,
    });

    if (!id) {
      console.error('❌ P24 webhook missing order ID');
      
      await sendPaymentErrorNotification({
        orderId: null,
        sessionId,
        amount,
        currency,
        p24OrderId: orderId,
        errorType: 'PARSE_ERROR',
        errorMessage: 'P24 webhook missing order ID in URL parameters',
        webhookContentType,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json({ error: 'No order id provided' }, { status: 400 });
    }

    // Initialize P24 for notification verification
    const p24 = new P24(
      Number(process.env.P24_MERCHANT_ID!),
      Number(process.env.P24_POS_ID!),
      process.env.P24_REST_API_KEY!,
      process.env.P24_CRC!,
      { sandbox: process.env.SANDBOX === 'true' }
    );

    // CRITICAL: Verify notification signature before processing
    // This ensures the webhook is genuinely from P24 and hasn't been tampered with
    try {
      const isNotificationValid = p24.verifyNotification(notificationData);
      if (!isNotificationValid) {
        console.error('❌ P24 notification signature verification failed', {
          orderId: id,
          sessionId,
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json({ error: 'Invalid notification signature' }, { status: 400 });
      }
      console.log('✅ P24 notification signature verified');
    } catch (verifyError) {
      console.error('❌ P24 notification verification threw error:', verifyError, {
        orderId: id,
        sessionId,
      });
      // Don't fail hard here - some P24 configurations might not have proper sign
      // Log it but continue with transaction verification
      console.warn('⚠️ Continuing without notification signature verification');
    }

    // Fetch order from DB to verify against authoritative values and idempotency
    const supabase = createClient();
    const { data: orderRow, error: orderFetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderFetchError) {
      console.error('❌ Failed to fetch order from DB:', orderFetchError, { orderId: id });
      
      await sendPaymentErrorNotification({
        orderId: id,
        sessionId,
        amount,
        currency,
        p24OrderId: orderId,
        errorType: 'UPDATE_ERROR',
        errorMessage: `Failed to fetch order from database: ${orderFetchError.message}`,
        webhookContentType,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency: if already marked paid or progressed beyond pending, return OK
    if (orderRow?.paid_at || (orderRow?.status && orderRow.status !== 1)) {
      console.log('ℹ️ Order already processed, skipping (idempotency)', {
        orderId: id,
        status: orderRow?.status,
        paid_at: orderRow?.paid_at,
      });
      return NextResponse.json({}, { status: 200 });
    }

    // Prefer DB amount; fall back to payload
    const expectedAmount: number = typeof orderRow?.amount === 'number' ? orderRow.amount : amount;
    
    // Verify the transaction with P24
    console.log('🔄 Verifying transaction with P24...', {
      orderId: id,
      expectedAmount,
      currency,
      p24OrderId: orderId,
      sessionId,
    });
    
    try {
      await verifyTransaction(expectedAmount, currency, orderId, sessionId);
      console.log('✅ P24 transaction verified successfully');
    } catch (verifyTxError) {
      const verifyErrorMessage = verifyTxError instanceof Error ? verifyTxError.message : 'Unknown verification error';
      const verifyErrorStack = verifyTxError instanceof Error ? verifyTxError.stack : undefined;
      
      console.error('❌ P24 transaction verification failed:', verifyTxError, {
        orderId: id,
        expectedAmount,
        currency,
        p24OrderId: orderId,
        sessionId,
      });
      
      await sendPaymentErrorNotification({
        orderId: id,
        sessionId,
        amount: expectedAmount,
        currency,
        p24OrderId: orderId,
        errorType: 'VERIFICATION_ERROR',
        errorMessage: `P24 transaction verification failed: ${verifyErrorMessage}`,
        errorStack: verifyErrorStack,
        webhookContentType,
        timestamp: new Date().toISOString(),
      });
      
      // Return 500 so P24 might retry the webhook
      return NextResponse.json({ error: 'Transaction verification failed' }, { status: 500 });
    }

    const { data, error } = await updateOrder(
      {
        paid_at: new Date(),
        payment_data: notificationData,
        status: 2,
      },
      id
    );

    if (error) {
      console.error('❌ Failed to update order:', error, { orderId: id });
      throw new Error(error.message);
    }
    
    console.log('✅ Order updated with payment data:', { orderId: id, status: 2 });

    // Guard: Prevent processing orders with empty product arrays
    if (!data.products?.array || data.products.array.length === 0) {
      console.error('🚫 Payment completion blocked: Empty products array', {
        order_id: id,
        user_id: data.user_id,
        guest_email: data.guest_email,
        amount: data.amount,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: 'Cannot process payment for order with empty products array' },
        { status: 400 }
      );
    }

    await checkUsedModifications(data);
    await updateItemsQuantity(data);
    console.log('payment/complete:data');
    console.log(data);

    // Generate invoice; if it fails, still complete digital orders to avoid long-running PENDING state
    try {
      await generateBill(data, id);
    } catch (billError) {
      console.error('❗ Invoice generation failed, setting fallback status', billError);
      // Fallback: mark digital orders as COMPLETED (3); keep physical orders as IN PROGRESS (2)
      try {
        await updateOrder(
          {
            status: data.need_delivery ? 2 : 3,
          },
          id
        );
      } catch (statusError) {
        console.error('❗ Failed to set fallback status after invoice error', statusError);
      }
    }

    await sendEmails(data);

    // Analytics tracking (supports both user and guest orders)
    await GAConversionPurchase({
      user_id: data.user_id || null, // Handle guest orders with null user_id
      value: amount / 100,
      transaction_id: String(orderId),
      items: data.products.array.map(
        ({
          id,
          name,
          quantity,
          discount,
          price,
        }: {
          id: string;
          name: string;
          quantity: number;
          discount: number;
          price: number;
        }) => ({
          item_id: id,
          item_name: name,
          quantity: quantity,
          price: discount ? discount / 100 : price / 100,
        })
      ),
    });
    await MetaConversionPurchase({
      user_id: data.user_id || null, // Handle guest orders with null user_id
      value: amount / 100,
      transaction_id: String(orderId),
      items: data.products.array.map(
        ({
          id,
          name,
          quantity,
          discount,
          price,
        }: {
          id: string;
          name: string;
          quantity: number;
          discount: number;
          price: number;
        }) => ({
          item_id: id,
          item_name: name,
          quantity: quantity,
          price: discount ? discount / 100 : price / 100,
        })
      ),
      email: data.billing.email,
    });

    console.log('✅ Payment completion successful:', { orderId: id });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('❌ Payment completion error:', {
      error: errorMessage,
      stack: errorStack,
      orderId: id,
      timestamp: new Date().toISOString(),
    });
    
    // Return 500 so P24 may retry the webhook
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
