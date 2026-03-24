import { waitUntil } from '@vercel/functions';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-admin';
import { P24, NotificationRequest } from '@ingameltd/node-przelewy24';
import { checkUsedModifications } from './check-used-modifications';
import { processBackground } from './process-background';
import { sendPaymentErrorNotification } from './send-error-notification';
import { updateOrder } from './update-order';

/**
 * Parse webhook body - handles both JSON and form-urlencoded formats
 * P24 can send webhooks in either format depending on configuration
 */
async function parseWebhookBody(request: Request): Promise<NotificationRequest | null> {
  const contentType = request.headers.get('content-type') || '';
  
  try {
    if (contentType.includes('application/json')) {
      return await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      return {
        merchantId: Number(params.get('merchantId')),
        posId: Number(params.get('posId')),
        sessionId: params.get('sessionId') || '',
        amount: Number(params.get('amount')),
        originAmount: Number(params.get('originAmount')),
        currency: params.get('currency') || 'PLN',
        orderId: Number(params.get('orderId')),
        methodId: Number(params.get('methodId')),
        statement: params.get('statement') || '',
        sign: params.get('sign') || '',
      };
    } else {
      // Try JSON first, then form-urlencoded as fallback
      const clonedRequest = request.clone();
      try {
        return await request.json();
      } catch {
        const text = await clonedRequest.text();
        const params = new URLSearchParams(text);
        if (params.get('sessionId')) {
          return {
            merchantId: Number(params.get('merchantId')),
            posId: Number(params.get('posId')),
            sessionId: params.get('sessionId') || '',
            amount: Number(params.get('amount')),
            originAmount: Number(params.get('originAmount')),
            currency: params.get('currency') || 'PLN',
            orderId: Number(params.get('orderId')),
            methodId: Number(params.get('methodId')),
            statement: params.get('statement') || '',
            sign: params.get('sign') || '',
          };
        }
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Failed to parse webhook body:', error);
    return null;
  }
}

export async function POST(request: Request) {
  const syncStart = Date.now();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const webhookContentType = request.headers.get('content-type');

  // Store notification data for error reporting (populated after parsing)
  let notificationData: NotificationRequest | null = null;

  try {
    // Parse webhook body (supports both JSON and form-urlencoded)
    notificationData = await parseWebhookBody(request);
    
    if (!notificationData) {
      console.error('❌ Failed to parse P24 notification body', { orderId: id });
      
      // Send error notification
      await sendPaymentErrorNotification({
        orderId: id,
        errorType: 'PARSE_ERROR',
        errorMessage: 'Failed to parse P24 webhook notification body',
        webhookContentType,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json({ error: 'Invalid notification format' }, { status: 400 });
    }

    // Extract fields from notification
    const { sessionId, amount, currency, orderId } = notificationData;

    if (!id) {
      console.error('❌ P24 webhook missing order ID');
      
      await sendPaymentErrorNotification({
        orderId: null,
        sessionId,
        amount,
        currency,
        p24OrderId: orderId,
        errorType: 'PARSE_ERROR',
        errorMessage: 'P24 webhook missing order ID in URL parameters',
        webhookContentType,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json({ error: 'No order id provided' }, { status: 400 });
    }

    // Initialize P24 for notification verification
    const p24 = new P24(
      Number(process.env.P24_MERCHANT_ID!),
      Number(process.env.P24_POS_ID!),
      process.env.P24_REST_API_KEY!,
      process.env.P24_CRC!,
      { sandbox: false }
    );

    // CRITICAL: Verify notification signature before processing
    // This ensures the webhook is genuinely from P24 and hasn't been tampered with
    const isNotificationValid = p24.verifyNotification(notificationData);
    if (!isNotificationValid) {
      console.error('❌ P24 notification signature verification failed', {
        orderId: id,
        sessionId,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: 'Invalid notification signature' }, { status: 400 });
    }

    // Fetch order from DB to verify against authoritative values and idempotency
    const supabase = createClient();
    const { data: orderRow, error: orderFetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderFetchError) {
      console.error('❌ Failed to fetch order from DB:', orderFetchError, { orderId: id });
      
      await sendPaymentErrorNotification({
        orderId: id,
        sessionId,
        amount,
        currency,
        p24OrderId: orderId,
        errorType: 'UPDATE_ERROR',
        errorMessage: `Failed to fetch order from database: ${orderFetchError.message}`,
        webhookContentType,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency: if already marked paid or progressed beyond pending, return OK
    if (orderRow?.paid_at || (orderRow?.status && orderRow.status !== 1)) {
      return NextResponse.json({}, { status: 200 });
    }

    // Prefer DB amount; fall back to payload
    const expectedAmount: number = typeof orderRow?.amount === 'number' ? orderRow.amount : amount;

    // ═══════════════════════════════════════════════════════════
    // SYNC PHASE: Update order as PAID immediately
    // This ensures P24 gets 200 response quickly
    // ═══════════════════════════════════════════════════════════

    const { data, error } = await updateOrder(
      {
        paid_at: new Date(),
        payment_data: notificationData,
        status: 2,
      },
      id
    );

    if (error) {
      console.error('❌ Failed to update order:', error, { orderId: id });
      throw new Error(error.message);
    }

    // Guard: Prevent processing orders with empty product arrays
    if (!data.products?.array || data.products.array.length === 0) {
      console.error('🚫 Payment completion blocked: Empty products array', {
        order_id: id,
        user_id: data.user_id,
        guest_email: data.guest_email,
        amount: data.amount,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: 'Cannot process payment for order with empty products array' },
        { status: 400 }
      );
    }

    // Mark coupons as used - must be sync to prevent race conditions
    await checkUsedModifications(data);

    // Schedule background processing (runs after we return 200)
    waitUntil(
      processBackground({
        orderId: id,
        orderData: data,
        notificationData,
        expectedAmount,
      })
    );

    // Return 200 immediately to P24
    const syncDuration = Date.now() - syncStart;
    console.log(`⏱️ [SYNC] Order ${id} completed in ${syncDuration}ms`);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('❌ Payment completion error:', { error: errorMessage, orderId: id });
    
    // Send error notification for unexpected errors
    await sendPaymentErrorNotification({
      orderId: id,
      sessionId: notificationData?.sessionId,
      amount: notificationData?.amount,
      currency: notificationData?.currency,
      p24OrderId: notificationData?.orderId,
      errorType: 'UNKNOWN_ERROR',
      errorMessage: `Unexpected error in payment webhook: ${errorMessage}`,
      errorStack,
      webhookContentType,
      timestamp: new Date().toISOString(),
    });
    
    // Return 500 so P24 may retry the webhook
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
