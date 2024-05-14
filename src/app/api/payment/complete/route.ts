'use server';
import { NextResponse } from 'next/server';
import { P24 } from '@ingameltd/node-przelewy24';
import { createClient } from '@/utils/supabase-admin';
import { sanityPatchQuantity, sanityPatchQuantityInVariant } from '@/utils/sanity.fetch';
import Hex from 'crypto-js/enc-hex';
import CryptoJS from 'crypto-js';
import Order from 'src/emails/Order';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_TOKEN);

export async function POST(request: Request) {
  const supabase = createClient();
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
        sandbox: process.env.SANDBOX === 'true',
      }
    );

    // verify transaction in P24 service
    await p24.verifyTransaction({
      amount,
      currency,
      orderId,
      sessionId,
    });

    const { data, error } = await supabase
      .from('orders')
      .update({
        paid_at: new Date(),
        payment_id: sessionId,
        status: 2,
      })
      .eq('id', id)
      .select(
        `
          *
        `
      )
      .single();

    const orderNeedDelivery = !!data?.shipping_method;

    // check if discount was used
    error: if (data && data.used_discount?.id) {
      // create new coupons_uses record
      const newRecord = await supabase.from('coupons_uses').insert({
        used_at: data.created_at,
        used_coupon: data.used_discount.id,
        used_by: data.user_id,
      });

      // check if error occurred during insert
      if (newRecord.error) break error;

      // get information about affiliation of used discount
      const couponData = await supabase
        .from('coupons')
        .select('affiliation_of')
        .eq('id', data.used_discount.id)
        .single();

      // check if used discount was affiliated by some user
      if (couponData.data && couponData.data.affiliation_of) {
        // get current amount of affiliation discount code owner
        const prevValueResult = await supabase
          .from('virtual_wallet')
          .select('amount')
          .eq('owner', couponData.data.affiliation_of)
          .single();

        // check if error occurred during select of code owner
        if (prevValueResult.error) break error;

        // add 25zł to affiliation discount code owner
        await supabase
          .from('virtual_wallet')
          .update({
            amount: prevValueResult.data!.amount + 25,
          })
          .eq('owner', couponData.data.affiliation_of);
      }
    }

    // check if virtual money was used
    error: if (data && data.used_virtual_money) {
      // get current amount of user virtual money
      const prevValueResult = await supabase.from('virtual_wallet').select('amount').eq('owner', data.user_id).single();

      // check if error occurred during selecting of user virtual money
      if (prevValueResult.error) break error;

      // decrease user virtual money by used amount
      await supabase
        .from('virtual_wallet')
        .update({
          amount: prevValueResult.data!.amount - data.used_virtual_money,
        })
        .eq('owner', data.user_id);
    }

    data?.products.array.forEach(
      async (product: {
        quantity: number;
        type: string;
        variantId: string;
        id: string;
        courses: null | { _id: string }[];
      }) => {
        // create courses_progress record for each course
        if (product.courses) {
          const newCourses = product.courses.map((el) => ({
            owner_id: data.user_id,
            course_id: el._id,
            progress: null,
          }));
          await supabase.from('courses_progress').insert(newCourses);
        }

        // TODO: maybe move this to create step??
        if (product.variantId) {
          // decrease quantity of chosen variant of variable product
          const res = await sanityPatchQuantityInVariant(product.id, product.variantId, product.quantity);
          console.log('change quantity of product variant', res);
        } else if (product.type === 'product') {
          // decrease quantity of each physical product
          const res = await sanityPatchQuantity(product.id, product.quantity);
          console.log('change quantity of product', res);
        }
      }
    );

    if (error) throw new Error(error.message);

    const { data: clientMessage, error: clientError } = await resend.emails.send({
      from: 'Kierunek Dzierganie <kontakt@kierunekdzierganie.pl>',
      to: [data.billing.email],
      subject: 'Nowe zamówienie!',
      reply_to: 'kontakt@zrobmimamo.pl',
      text: '',
      react: Order({ data: data, type: orderNeedDelivery ? 'CREATE_ORDER' : 'ORDER_COMPLETED' }),
    });
    console.log(clientMessage, clientError);

    const { data: messageData, error: messageError } = await resend.emails.send({
      from: 'Kierunek Dzierganie <kontakt@kierunekdzierganie.pl>',
      to: ['kierunek.dzierganie@gmail.com'],
      subject: 'Nowe zamówienie!',
      reply_to: 'kontakt@zrobmimamo.pl',
      text: '',
      react: Order({ data: data, type: 'NEW_ORDER' }),
    });
    console.log(messageData, messageError);

    // Generate faktur
    const requestContent = JSON.stringify({
      Zaplacono: data.amount,
      LiczOd: 'BRT',
      DataWystawienia: new Date().toISOString().split('T')[0],
      MiejsceWystawienia: 'Miasto',
      DataSprzedazy: new Date(data.created_at).toISOString().split('T')[0],
      FormatDatySprzedazy: 'DZN',
      SposobZaplaty: 'P24',
      RodzajPodpisuOdbiorcy: 'OUP',
      // OUP (osoba upoważniona do otrzymania faktury VAT);
      // UPO (upoważnienie);
      // BPO (bez podpisu odbiorcy);
      // BWO (bez podpisu odbiorcy i wystawcy)
      Numer: null,
      Pozycje: [
        // @ts-expect-error hard to implement types here
        ...data.products.array.map((product) => {
          if (product.type === 'product') {
            return {
              StawkaVat: 0.08,
              Ilosc: product.quantity,
              CenaJednostkowa: (product.discount ?? product.price) / 100,
              NazwaPelna: product.name,
              Jednostka: 'sztuk',
              PKWiU: '',
              TypStawkiVat: 'PRC',
            };
          }

          return {
            StawkaVat: 0.08,
            Ilosc: 1,
            CenaJednostkowa: (product.discount ?? product.price) / 100,
            NazwaPelna: product.name,
            Jednostka: 'sztuk',
            PKWiU: '',
            TypStawkiVat: 'PRC',
          };
        }),
      ],
      Kontrahent: {
        Nazwa: 'Martyna Brzozowska',
        Identyfikator: 'Zrób Mi Mamo',
        NIP: '5222677740',
        Ulica: 'Moszyn 50',
        KodPocztowy: '06-100',
        Kraj: 'Polska',
        Miejscowosc: 'Pułtusk',
        Email: 'kontakt@zrobmimamo.pl',
        OsobaFizyczna: false,
      },
    });

    const url = 'https://www.ifirma.pl/iapi/fakturakraj.json';
    const user = 'martyna_prochowska@o2.pl';
    const keyType = 'faktura';

    const key = CryptoJS.enc.Hex.parse(process.env.IFIRMA_API_KEY!);
    const hmac = CryptoJS.HmacSHA1(url + user + keyType + requestContent, key);
    const hash = Hex.stringify(hmac);

    const billRes = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        Authentication: `IAPIS user=${user}, hmac-sha1=${hash}`,
      },
      body: requestContent,
    });
    console.log(billRes);
    const billId = await billRes.json();
    console.log(billId);

    await supabase
      .from('orders')
      .update({
        bill_id: billId.response.Identyfikator,
        status: orderNeedDelivery ? 2 : 3,
      })
      .eq('id', id);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
