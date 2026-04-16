import { NextResponse } from 'next/server';

import { createInvoiceForOrder, InvoiceCreationError } from './invoice-service';

const hasCronAuthorization = (request: Request): boolean => {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
};

export async function POST(request: Request) {
  if (!hasCronAuthorization(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: { data?: unknown; dryRun?: boolean; orderId?: number | string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowy format żądania' }, { status: 400 });
  }

  try {
    const result = await createInvoiceForOrder(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InvoiceCreationError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown invoice error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
