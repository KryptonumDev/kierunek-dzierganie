import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');
  const id = searchParams.get('id');

  console.log('🔄 Payment verify request:', {
    session,
    orderId: id,
    timestamp: new Date().toISOString(),
  });

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

    console.log('📦 P24 transaction status response:', {
      session,
      orderId: id,
      status: responseData?.data?.status,
      hasData: !!responseData?.data,
    });

    // Determine redirect URL based on order type
    const redirectUrl = await getRedirectUrl(id);

    // Safely check response status - handle undefined data gracefully
    const transactionStatus = responseData?.data?.status;
    
    // P24 status codes: 1 = pending, 2 = completed
    if (transactionStatus === 1 || transactionStatus === 2) {
      console.log('✅ Payment verified, redirecting to:', redirectUrl);
      // Note: Cart clearing is handled on the thank you page for guest orders
      // For user orders, the cart should be cleared client-side after redirect
      return NextResponse.redirect(redirectUrl);
    }

    // For any other status (including undefined), still redirect to the order page
    // The webhook will handle the actual payment verification
    console.log('⚠️ Transaction status not confirmed, redirecting anyway:', {
      status: transactionStatus,
      redirectUrl,
    });
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Payment verify error:', error, {
      session,
      orderId: id,
    });
    
    // Try to redirect to order page if we have an ID, otherwise homepage
    try {
      const redirectUrl = await getRedirectUrl(id);
      return NextResponse.redirect(redirectUrl);
    } catch {
      return NextResponse.redirect('https://kierunekdzierganie.pl/');
    }
  }
}

async function getRedirectUrl(orderId: string | null): Promise<string> {
  if (!orderId) {
    return 'https://kierunekdzierganie.pl/';
  }

  try {
    const supabase = createClient();
    const { data: order } = await supabase.from('orders').select('is_guest_order').eq('id', orderId).single();

    // Guest orders redirect to thank you page, user orders to dashboard
    if (order?.is_guest_order) {
      return 'https://kierunekdzierganie.pl/dziekujemy-za-zamowienie';
    } else {
      return `https://kierunekdzierganie.pl/moje-konto/zakupy/${orderId}`;
    }
  } catch (error) {
    console.error('Error fetching order data:', error);
    // Fallback to homepage for safety
    return 'https://kierunekdzierganie.pl/';
  }
}
