'use server';
import { NextResponse } from 'next/server';
import { checkUsedModifications } from './check-used-modifications';
import { GAConversionPurchase } from './GAConversionPurchase';
import { generateBill } from './generate-bill';
import { MetaConversionPurchase } from './MetaConversionPurchase';
import { sendEmails } from './send-emails';
import { updateItemsQuantity } from './update-items-quantity';
import { updateOrder } from './update-order';
import { verifyTransaction } from './verify-transaction';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { sessionId, amount, currency, orderId } = requestData;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'No order id provided' }, { status: 400 });

    await verifyTransaction(amount, currency, orderId, sessionId);

    const { data, error } = await updateOrder(
      {
        paid_at: new Date(),
        payment_data: requestData,
        status: 2,
      },
      id
    );

    if (error) throw new Error(error.message);

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
      transaction_id: orderId,
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
      transaction_id: orderId,
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

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
