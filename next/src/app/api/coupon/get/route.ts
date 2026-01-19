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
          state,
          expiration_date,
          coupons_types (
            coupon_type
          ),
          voucher_amount_left,
          discounted_product,
          discounted_products,
          category_restrictions
        `
      )
      .eq('code', code)
      .single();

    if (error?.code === 'PGRST116' || data?.state === 1) {
      return NextResponse.json({ error: 'Kod rabatowy nie istnieje' }, { status: 500 });
    }

    if (error) NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
