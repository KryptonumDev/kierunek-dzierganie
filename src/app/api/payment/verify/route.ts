import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = searchParams.get('id');

    const transactionHeaders = new Headers();
    transactionHeaders.append('Content-Type', 'application/json');
    transactionHeaders.append(
      'Authorization',
      `Basic ${btoa(`${Number(process.env.P24_POS_ID)}:${process.env.P24_REST_API_KEY}`)}`
    );

    const response = await fetch(`https://secure.przelewy24.pl/api/v1/transaction/by/sessionId/${session}`, {
      method: 'GET',
      headers: transactionHeaders,
    });

    const responseData = await response.json();
    console.log(responseData);
    // Cannot read properties of undefined (reading 'status')
    if (responseData.data.status == 1 || responseData.data.status == 2) {
      // TODO: payment success status
      return NextResponse.redirect('https://kierunekdzierganie.pl/');
    }

    // TODO: payment await status
    return NextResponse.redirect('https://kierunekdzierganie.pl/');
  } catch (error) {
    console.log(error);
    // TODO: payment error status
    return NextResponse.redirect('https://kierunekdzierganie.pl/');
  }
}