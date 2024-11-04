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
    await checkUsedModifications(data);
    await sendEmails(data);
    await updateItemsQuantity(data);
    console.log('payment/complete:data');
    console.log(data);
    await generateBill(data, id);

    await GAConversionPurchase({
      user_id: data.user_id,
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
      user_id: data.user_id,
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
