import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';

const CRON_SECRET = Deno.env.get('CRON_SECRET');
const STOREFRONT_APP_URL = Deno.env.get('STOREFRONT_APP_URL') ?? Deno.env.get('ADMIN_APP_URL');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const BATCH_SIZE = 20;
const ELIGIBLE_STATUSES = [2, 3];
const TERMINAL_SKIP_PATTERNS = [
  'wyłącznie voucher',
  'nie wymaga wystawienia faktury',
];

type OrderCandidate = {
  id: number;
  invoice_retry_count: number;
  created_at: string;
  status: number;
  bill: string | null;
};

const json = (body: unknown, status: number = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isAuthorized = (request: Request) =>
  !!CRON_SECRET && request.headers.get('authorization') === `Bearer ${CRON_SECRET}`;

const isTerminalSkip = (message: string | undefined) => {
  if (!message) return false;

  const normalized = message.toLowerCase();
  return TERMINAL_SKIP_PATTERNS.some((pattern) => normalized.includes(pattern));
};

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  if (!isAuthorized(request)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  if (!STOREFRONT_APP_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(
      {
        error: 'Missing required environment variables',
        details: {
          hasStorefrontAppUrl: !!STOREFRONT_APP_URL,
          hasSupabaseUrl: !!SUPABASE_URL,
          hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
        },
      },
      500
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const now = new Date();
  const minimumAge = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const maximumAge = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, invoice_retry_count, created_at, status, bill')
    .is('bill', null)
    .lt('invoice_retry_count', 3)
    .in('status', ELIGIBLE_STATUSES)
    .gte('created_at', maximumAge)
    .lte('created_at', minimumAge)
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)
    .returns<OrderCandidate[]>();

  if (error) {
    return json({ error: 'Failed to fetch invoice retry candidates', details: error.message }, 500);
  }

  if (!orders || orders.length === 0) {
    return json({
      ok: true,
      processed: 0,
      created: 0,
      skipped: 0,
      failed: 0,
      aborted: false,
    });
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;
  let aborted = false;
  let abortedReason: string | null = null;

  for (const order of orders) {
    const response = await fetch(`${STOREFRONT_APP_URL.replace(/\/$/, '')}/api/ifirma/create-faktura`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: order.id }),
    });

    if (response.status >= 300 && response.status < 400) {
      aborted = true;
      abortedReason = `Storefront invoice route redirected with status ${response.status}`;
      break;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      aborted = true;
      abortedReason = `Storefront invoice route returned non-JSON content (${contentType || 'unknown'})`;
      break;
    }

    let payload: Record<string, unknown> | null = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (response.ok && (typeof payload?.id === 'string' || payload?.alreadyExists === true)) {
      created++;
      continue;
    }

    if (response.ok && payload?.skipped === true) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ invoice_retry_count: 3 })
        .eq('id', order.id);

      if (updateError) {
        return json(
          {
            error: 'Failed to persist terminal invoice skip',
            details: updateError.message,
            orderId: order.id,
          },
          500
        );
      }

      skipped++;
      continue;
    }

    if (response.ok) {
      aborted = true;
      abortedReason = `Storefront invoice route returned an unexpected success payload for order ${order.id}`;
      break;
    }

    if (response.status === 401 || response.status === 403) {
      aborted = true;
      abortedReason = `Storefront invoice route authorization failed with status ${response.status}`;
      break;
    }

    const errorMessage =
      typeof payload?.error === 'string'
        ? payload.error
        : typeof payload?.message === 'string'
          ? payload.message
          : `HTTP ${response.status}`;

    const nextRetryCount = isTerminalSkip(errorMessage) ? 3 : order.invoice_retry_count + 1;

    const { error: updateError } = await supabase
      .from('orders')
      .update({ invoice_retry_count: nextRetryCount })
      .eq('id', order.id);

    if (updateError) {
      return json(
        {
          error: 'Failed to update invoice retry count',
          details: updateError.message,
          orderId: order.id,
        },
        500
      );
    }

    if (isTerminalSkip(errorMessage)) {
      skipped++;
      continue;
    }

    failed++;
  }

  return json({
    ok: !aborted,
    processed: aborted ? created + skipped + failed : orders.length,
    created,
    skipped,
    failed,
    aborted,
    abortedReason,
    selectedOrderIds: orders.map((order) => order.id),
  });
});
