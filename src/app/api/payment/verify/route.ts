import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');
  const id = searchParams.get('id');

  try {
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
    // Cannot read properties of undefined (reading 'status')
    if (responseData.data.status == 1 || responseData.data.status == 2) {
      // TODO: payment success status
      return NextResponse.redirect(`https://kierunek-dzierganie-git-beta-kryptonum.vercel.app/moje-konto/zakupy/${id}`);
    }
    
    // TODO: payment await status
    return NextResponse.redirect(`https://kierunek-dzierganie-git-beta-kryptonum.vercel.app/moje-konto/zakupy/${id}`);
  } catch (error) {
    console.log(error);
    // TODO: payment error status
    return NextResponse.redirect(`https://kierunek-dzierganie-git-beta-kryptonum.vercel.app/moje-konto/zakupy/${id}`);
  }
}
