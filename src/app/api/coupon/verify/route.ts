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
  const { code, userId, cart } = await request.json();
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select(
        `
        id,  
        amount,
        state,
        expiration_date,
        per_user_limit,
        affiliation_of,
        use_limit,
        coupons_types (
          coupon_type
        ),
        voucher_amount_left,
        discounted_product
        `
      )
      .eq('code', code)
      .single();

    if (error?.code === 'PGRST116' || data?.state === 1) {
      return NextResponse.json({ error: 'Kod rabatowy nie istnieje' }, { status: 500 });
    }

    if (data?.affiliation_of === userId) {
      return NextResponse.json({ error: 'Nie możesz użyć własnego kodu afiliacyjnego' }, { status: 500 });
    }

    if (data?.expiration_date < new Date().toISOString()) {
      return NextResponse.json({ error: 'Kod rabatowy jest przeterminowany' }, { status: 500 });
    }

    if (data?.per_user_limit) {
      if (!userId)
        return NextResponse.json({ error: 'Musisz być zalogowany, aby użyć tego kodu rabatowego' }, { status: 500 });

      const { count } = await supabase
        .from('coupons_uses')
        .select('*', { count: 'exact', head: true })
        .eq('used_coupon', data.id)
        .eq('used_by', userId);

      if (count && data.per_user_limit >= count!) {
        return NextResponse.json({ error: 'Osiągnięto limit użyć kodu rabatowego' }, { status: 500 });
      }
    }

    if (data?.use_limit) {
      const { count } = await supabase
        .from('coupons_uses')
        .select('*', { count: 'exact', head: true })
        .eq('used_coupon', data.id);

      if (count && data?.use_limit >= count!) {
        return NextResponse.json({ error: 'Osiągnięto limit użyć kodu rabatowego' }, { status: 500 });
      }
    }

    if (data?.affiliation_of) {
      if (!userId)
        return NextResponse.json({ error: 'Musisz być zalogowany, aby użyć tego kodu rabatowego' }, { status: 500 });

      const { data: affiliationData } = await supabase
        .from('profiles')
        .select('courses_progress(count), orders(count)')
        .eq('id', userId)
        .single();

      if (affiliationData) {
        if (affiliationData.courses_progress[0]!.count >= 1 || affiliationData.orders[0]!.count >= 1) {
          return NextResponse.json(
            { error: 'Tylko nowi użytkownicy mogą skorzystać z kodu afiliacyjnego' },
            { status: 500 }
          );
        }
      }
    }

    // @ts-expect-error wrong types from supabase
    if (data?.coupons_types?.coupon_type === 'FIXED PRODUCT') {
      const inCart = cart.find((item: { product: string }) => item.product === data?.discounted_product.id);

      if (!inCart) {
        return NextResponse.json({ error: 'Kod rabatowy nie dotyczy żadnego produktu w koszyku' }, { status: 500 });
      }
    }

    // @ts-expect-error wrong types from supabase
    if (data?.coupons_types.coupon_type === 'VOUCHER') {
      if (data.voucher_amount_left === 0) {
        return NextResponse.json({ error: 'Voucher jest wyczerpany' }, { status: 500 });
      }
    }

    if (error) NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
