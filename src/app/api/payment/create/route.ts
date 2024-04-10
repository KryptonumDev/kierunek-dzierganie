import { P24, Currency, Country, Language, Encoding } from '@ingameltd/node-przelewy24';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { InputState } from '@/components/_global/Header/Checkout/Checkout.types';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { input, description }: { input: InputState; description: string } = await request.json();

  try {
    const p24 = new P24(
      Number(process.env.P24_MERCHANT_ID!),
      Number(process.env.P24_POS_ID!),
      process.env.P24_REST_API_KEY!,
      process.env.P24_CRC!,
      {
        sandbox: !!process.env.SANDBOX,
      }
    );

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: input.user_id,
        products: input.products,
        billing: input.billing,
        shipping: input.shipping,
        amount: input.amount,
        used_discount: input.usedDiscount
          ? {
            amount: input.usedDiscount,
            id: input.usedDiscount,
          }
          : null,
        paid_at: null,
        payment_id: null,
        payment_method: 'Przelewy24',
      })
      .select('id')
      .single();

    if (!data || error) throw new Error(error?.message || 'Error while creating order');

    const order = {
      sessionId: `${data.id}`,
      amount: Number(input.amount),
      currency: Currency.PLN,
      description: description,
      email: input.billing.email,
      country: Country.Poland,
      language: Language.PL,
      urlReturn: `https://kierunekdzierganie.pl/api/payment/verify/?session=${data.id}`,
      urlStatus: `https://kierunekdzierganie.pl/api/payment/complete/?session=${data.id}`,
      timeLimit: 60,
      encoding: Encoding.UTF8,
      city: input.billing.city,
      address: input.billing.address1,
      zip: input.billing.postcode,
      client: input.billing.firstName,
    };

    const response = await p24.createTransaction(order);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
