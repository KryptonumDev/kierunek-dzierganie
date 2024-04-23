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
  const { code, userId } = await request.json();

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select(
        `
        id,  
        amount,
        expiration_date,
        per_user_limit,
        affiliation_of,
        use_limit,
        coupons_types (
          coupon_type
        )
        `
      )
      .eq('code', code)
      .single();

    if (error?.code === 'PGRST116') {
      return NextResponse.json({ error: 'Kod rabatowy nie istnieje' }, { status: 500 });
    }

    if (data?.affiliation_of === userId) {
      return NextResponse.json({ error: 'Nie możesz użyć własnego kodu afiliacyjnego' }, { status: 500 });
    }

    if (data?.expiration_date < new Date().toISOString()) {
      return NextResponse.json({ error: 'Kod rabatowy jest przeterminowany' }, { status: 500 });
    }

    if (data?.per_user_limit) {
      const { count } = await supabase
        .from('coupons_uses')
        .select('*', { count: 'exact', head: true })
        .eq('used_coupon', data.id)
        .eq('used_by', userId);

      if (data.per_user_limit >= count!) {
        return NextResponse.json({ error: 'Osiągnięto limit użyć kodu rabatowego' }, { status: 500 });
      }
    }

    if (data?.use_limit) {
      const { count } = await supabase
        .from('coupons_uses')
        .select('*', { count: 'exact', head: true })
        .eq('used_coupon', data.id);

      if (data?.use_limit >= count!) {
        return NextResponse.json({ error: 'Osiągnięto limit użyć kodu rabatowego' }, { status: 500 });
      }
    }

    if (error) NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
