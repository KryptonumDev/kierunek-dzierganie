import { resolvePostPurchaseOffer } from '@/utils/resolve-post-purchase-offer';
import { createClient as createServerClient } from '@/utils/supabase-server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params;

  const serverClient = createServerClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await resolvePostPurchaseOffer(orderId, user.id);

  if (result.type === 'not-found') {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (result.type === 'forbidden') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (result.type === 'no-offer') {
    return NextResponse.json({ offer: null });
  }

  return NextResponse.json({ offer: result.offer });
}
