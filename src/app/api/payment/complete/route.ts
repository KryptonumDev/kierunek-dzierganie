'use server';
import { NextResponse } from 'next/server';
import { verifyTransaction } from './verify-transaction';
import { updateOrder } from './update-order';
import { checkUsedModifications } from './check-used-modifications';
import { updateItemsQuantity } from './update-items-quantity';
import { sendEmails } from './send-emails';
import { generateBill } from './generate-bill';

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
    console.log('Dane użytkownika przed automatyzacjami', data);
    await checkUsedModifications(data);
    await updateItemsQuantity(data);
    await sendEmails(data);
    await generateBill(data, id);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
