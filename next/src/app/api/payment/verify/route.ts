import '@/utils/load-environment'; // Load environment configuration
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');
  const id = searchParams.get('id');

  try {
    // Log P24 environment (server-side only)
    if (typeof window === 'undefined') {
      console.log(`💳 P24 Verify Mode: ${process.env.SANDBOX === 'true' ? 'SANDBOX (Test)' : 'PRODUCTION (Real)'}`);
    }

    const transactionHeaders = new Headers();
    transactionHeaders.append('Content-Type', 'application/json');
    transactionHeaders.append(
      'Authorization',
      `Basic ${btoa(`${Number(process.env.P24_POS_ID)}:${process.env.P24_REST_API_KEY}`)}`
    );

    // Use environment-aware API URL
    const apiUrl =
      process.env.SANDBOX === 'true'
        ? `https://sandbox.przelewy24.pl/api/v1/transaction/by/sessionId/${session}`
        : `https://secure.przelewy24.pl/api/v1/transaction/by/sessionId/${session}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: transactionHeaders,
    });

    const responseData = await response.json();
    // Cannot read properties of undefined (reading 'status')
    if (responseData.data.status == 1 || responseData.data.status == 2) {
      // TODO: payment success status
      return NextResponse.redirect(`https://kierunekdzierganie.pl/moje-konto/zakupy/${id}`);
    }

    // TODO: payment await status
    return NextResponse.redirect(`https://kierunekdzierganie.pl/moje-konto/zakupy/${id}`);
  } catch (error) {
    console.log(error);
    // TODO: payment error status
    return NextResponse.redirect(`https://kierunekdzierganie.pl/moje-konto/zakupy/${id}`);
  }
}
