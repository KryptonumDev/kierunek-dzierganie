import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { code } = await request.json();

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select(
        `
        id,  
        amount,
        coupons_types (
          coupon_type
        )
        `
      )
      .eq('code', code)
      .single();

    if (error) NextResponse.json({ error }, { status: 500 });
    if (!data?.id) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
