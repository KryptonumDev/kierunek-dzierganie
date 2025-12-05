import { P24, Currency, Country, Language, Encoding } from '@ingameltd/node-przelewy24';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const {
    id,
    email,
    city,
    address1,
    postcode,
    firstName,
    totalAmount,
    description,
  }: {
    order: string;
    id: string;
    email: string;
    city: string;
    address1: string;
    postcode: string;
    firstName: string;
    totalAmount: number | string;
    description: string;
  } = await request.json();

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

    // Log P24 environment (server-side only)
    if (typeof window === 'undefined') {
      console.log(`💳 P24 Recreate Mode: ${process.env.SANDBOX === 'true' ? 'SANDBOX (Test)' : 'PRODUCTION (Real)'}`);
    }

    const session = String(id + 'X' + Math.floor(Math.random() * 10000));

    const order = {
      sessionId: session,
      amount: Number(totalAmount),
      currency: Currency.PLN,
      description: description,
      email: email,
      country: Country.Poland,
      language: Language.PL,
      urlReturn: `https://kierunekdzierganie.pl/api/payment/verify/?session=${session}&id=${id}`,
      urlStatus: `https://kierunekdzierganie.pl/api/payment/complete/?session=${session}&id=${id}`,
      timeLimit: 60,
      encoding: Encoding.UTF8,
      city: city,
      address: address1,
      zip: postcode,
      client: firstName,
    };

    const response = await p24.createTransaction(order);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
