import { NextResponse } from 'next/server';
import { P24 } from '@ingameltd/node-przelewy24';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { sessionId, amount, currency, orderId } = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const p24 = new P24(
      Number(process.env.P24_MERCHANT_ID!),
      Number(process.env.P24_POS_ID!),
      process.env.P24_REST_API_KEY!,
      process.env.P24_CRC!,
      {
        sandbox: !!process.env.SANDBOX,
      }
    );

    await p24.verifyTransaction({
      amount,
      currency,
      orderId,
      sessionId,
    });

    const { error } = await supabase
      .from('orders')
      .update({
        paid_at: new Date(),
        payment_id: sessionId,
      })
      .eq('id', id);

    if (error) throw new Error(error.message);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
