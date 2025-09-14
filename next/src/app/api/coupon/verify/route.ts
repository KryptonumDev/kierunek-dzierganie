import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { code, userId, cart, isSubmit } = await request.json();
  try {
    const { data: rows, error } = await supabase
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
        discounted_product,
        discounted_products
        `
      )
      .eq('code', code);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const now = new Date().toISOString();
    const list = rows ?? [];

    if (list.length === 0) {
      return NextResponse.json({ error: 'Kod rabatowy nie istnieje' }, { status: 500 });
    }

    // Score coupons by applicability to current cart (for FIXED PRODUCT).
    const scored = list
      .filter((r) => r.state !== 1 && (!r.expiration_date || r.expiration_date >= now))
      .map((r) => {
        // @ts-expect-error wrong types from supabase
        const type = r?.coupons_types?.coupon_type as string | undefined;
        if (type === 'FIXED PRODUCT') {
          const eligibleIds =
            Array.isArray(r?.discounted_products) && r.discounted_products.length > 0
              ? r.discounted_products.map((p: { id: string }) => p.id)
              : r?.discounted_product?.id
                ? [r.discounted_product.id]
                : [];
          const eligibleCount =
            eligibleIds.length > 0
              ? Array.isArray(cart)
                ? cart.reduce(
                    (sum: number, item: { product: string; quantity?: number }) =>
                      eligibleIds.includes(item.product) ? sum + (item.quantity ?? 1) : sum,
                    0
                  )
                : 0
              : 0;
          return { row: r, eligibleCount };
        }
        return { row: r, eligibleCount: 1 }; // Non-product-specific coupons considered applicable by default
      })
      .sort((a, b) => b.eligibleCount - a.eligibleCount);

    // Prefer coupon that applies to the cart; otherwise take first active row; otherwise fallback to first row
    const selected = scored.find((s) => s.eligibleCount > 0)?.row ?? scored[0]?.row ?? list[0];

    if (!selected) {
      return NextResponse.json({ error: 'Kod rabatowy nie istnieje' }, { status: 500 });
    }

    // Affiliation + submit pathway
    if (isSubmit) {
      if (selected?.affiliation_of && cart.find((item: { _type: string }) => item._type !== 'course')) {
        return NextResponse.json({ error: 'Afiliacyjny kod rabatowy jest dostępny tylko dla kursów' }, { status: 500 });
      }
      return NextResponse.json(selected);
    }

    if (selected?.affiliation_of && cart.find((item: { _type: string }) => item._type !== 'course')) {
      return NextResponse.json({ error: 'Afiliacyjny kod rabatowy jest dostępny tylko dla kursów' }, { status: 500 });
    }

    if (selected?.affiliation_of === userId) {
      return NextResponse.json({ error: 'Nie możesz użyć własnego kodu afiliacyjnego' }, { status: 500 });
    }

    if (selected?.expiration_date && selected.expiration_date < now) {
      return NextResponse.json({ error: 'Kod rabatowy jest przeterminowany' }, { status: 500 });
    }

    if (selected?.per_user_limit) {
      if (!userId)
        return NextResponse.json({ error: 'Musisz być zalogowany, aby użyć tego kodu rabatowego' }, { status: 500 });

      const { count } = await supabase
        .from('coupons_uses')
        .select('*', { count: 'exact', head: true })
        .eq('used_coupon', selected.id)
        .eq('used_by', userId);

      if (typeof count === 'number' && count >= selected.per_user_limit) {
        return NextResponse.json({ error: 'Osiągnięto limit użyć kodu rabatowego' }, { status: 500 });
      }
    }

    if (selected?.use_limit) {
      const { count } = await supabase
        .from('coupons_uses')
        .select('*', { count: 'exact', head: true })
        .eq('used_coupon', selected.id);

      if (typeof count === 'number' && count >= selected.use_limit) {
        return NextResponse.json({ error: 'Osiągnięto limit użyć kodu rabatowego' }, { status: 500 });
      }
    }

    if (selected?.affiliation_of) {
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
    if (selected?.coupons_types?.coupon_type === 'FIXED PRODUCT') {
      const eligibleIds =
        Array.isArray(selected?.discounted_products) && selected.discounted_products.length > 0
          ? selected.discounted_products.map((p: { id: string }) => p.id)
          : selected?.discounted_product?.id
            ? [selected.discounted_product.id]
            : [];

      const eligibleCount =
        eligibleIds.length > 0
          ? Array.isArray(cart)
            ? cart.reduce(
                (sum: number, item: { product: string; quantity?: number }) =>
                  eligibleIds.includes(item.product) ? sum + (item.quantity ?? 1) : sum,
                0
              )
            : 0
          : 0;

      if (eligibleCount === 0) {
        return NextResponse.json({ error: 'Kod rabatowy nie dotyczy żadnego produktu w koszyku' }, { status: 500 });
      }

      (selected as unknown as { eligibleCount?: number }).eligibleCount = eligibleCount;
    }

    // @ts-expect-error wrong types from supabase
    if (selected?.coupons_types?.coupon_type === 'VOUCHER') {
      if (selected.voucher_amount_left === 0) {
        return NextResponse.json({ error: 'Voucher jest wyczerpany' }, { status: 500 });
      }
    }

    // Override amount for affiliate coupons to always be 50 PLN
    if (selected?.affiliation_of) {
      selected.amount = 5000; // Always 50 PLN for affiliate codes
    }

    return NextResponse.json(selected);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
