import { P24, Currency, Country, Language, Encoding } from '@ingameltd/node-przelewy24';
import { NextResponse } from 'next/server';
import type { InputState } from '@/components/_global/Header/Checkout/Checkout.types';
import { createClient } from '@/utils/supabase-admin';
import { updateItemsQuantity } from '../complete/update-items-quantity';
import { sendEmails } from '../complete/send-emails';
import { checkUsedModifications } from '../complete/check-used-modifications';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { input, description }: { input: InputState; description: string } = await request.json();
  const supabase = createClient();

  // update user default data for next orders
  await supabase
    .from('profiles')
    .update({ billing_data: input.billing, shipping_data: input.shipping })
    .eq('id', input.user_id);

  try {
    const p24 = new P24(
      Number(process.env.P24_MERCHANT_ID!),
      Number(process.env.P24_POS_ID!),
      process.env.P24_REST_API_KEY!,
      process.env.P24_CRC!,
      {
        sandbox: process.env.SANDBOX === 'true',
      }
    );
    const { data: settingsData } = await supabase.from('settings').select('value').eq('name', 'ifirma').single();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: input.user_id,
        products: {
          array: input.products?.array.map((product) => ({
            ...product,
            // @ts-expect-error - product.courses is not defined in types... todo later
            vat: product.courses ? settingsData?.value.vatCourses : settingsData?.value.vatPhysical,
            // @ts-expect-error - product.courses is not defined in types... todo later
            ryczalt: product.courses ? settingsData?.value.ryczaltCourses : settingsData?.value.ryczaltPhysical,
          })),
        },
        status: input.totalAmount <= 0 ? (input.needDelivery ? 2 : 3) : 1,
        billing: input.billing,
        shipping: input.needDelivery && !input.shippingMethod?.data ? input.shipping : null,
        amount: input.totalAmount,
        shipping_method: input.needDelivery ? input.shippingMethod : null,
        used_discount: input.discount || null,
        used_virtual_money: input.virtualMoney,
        paid_at: null,
        payment_id: null,
        payment_method: 'Przelewy24',
        need_delivery: input.needDelivery,
        client_notes: input.client_notes,
      })
      .select('*')
      .single();

    if (!data || error) throw new Error(error?.message || 'Error while creating order');

    if (input.totalAmount <= 0) {
      await checkUsedModifications(data);
      await updateItemsQuantity(data);
      await sendEmails(data);

      return NextResponse.json({ link: `https://kierunekdzierganie.pl/moje-konto/zakupy/${data.id}` });
    } else {
      const session = String(data.id + 'X' + Math.floor(Math.random() * 10000));

      const order = {
        sessionId: session,
        amount: Number(input.totalAmount),
        currency: Currency.PLN,
        description: description,
        email: input.billing.email,
        country: Country.Poland,
        language: Language.PL,
        urlReturn: `https://kierunekdzierganie.pl/api/payment/verify/?session=${session}&id=${data.id}`,
        urlStatus: `https://kierunekdzierganie.pl/api/payment/complete/?session=${session}&id=${data.id}`,
        timeLimit: 60,
        encoding: Encoding.UTF8,
        city: input.billing.city,
        address: input.billing.address1,
        zip: input.billing.postcode,
        client: input.billing.firstName,
      };

      const response = await p24.createTransaction(order);

      return NextResponse.json(response);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
