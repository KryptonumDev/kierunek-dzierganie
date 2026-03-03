import { hasPostPurchaseOffer } from '@/utils/resolve-post-purchase-offer';
import { createClient } from '@/utils/supabase-admin';
import { siteUrl } from '@/utils/site-url';
import { NextResponse } from 'next/server';

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
      return NextResponse.redirect(siteUrl + '/');
    }
  }
}

async function getRedirectUrl(orderId: string | null): Promise<string> {
  if (!orderId) {
    return siteUrl + '/';
  }

  try {
    const supabase = createClient();
    const { data: order } = await supabase
      .from('orders')
      .select('is_guest_order, products')
      .eq('id', orderId)
      .single();

    // Guest orders always go to the static thank-you page
    if (order?.is_guest_order) {
      return siteUrl + '/dziekujemy-za-zamowienie';
    }

    // Logged-in user: check whether any purchased product has postPurchaseOffer configured
    const productItems: Array<{ id: string; type: string }> = order?.products?.array ?? [];
    const offerConfigured = await hasPostPurchaseOffer(productItems);

    if (offerConfigured) {
      console.log('🎁 Post-purchase offer found, redirecting to /dziekujemy:', orderId);
      return `${siteUrl}/dziekujemy/${orderId}`;
    }

    return `${siteUrl}/moje-konto/zakupy/${orderId}`;
  } catch (error) {
    console.error('Error fetching order data:', error);
    return siteUrl + '/';
  }
}
