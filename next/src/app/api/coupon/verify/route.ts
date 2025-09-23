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
  const { code, codes, userId, cart, isSubmit } = await request.json();
  try {
    // If no code(s) provided, treat as no coupon scenario (return OK)
    if ((!code || String(code).trim().length === 0) && (!Array.isArray(codes) || codes.length === 0)) {
      return NextResponse.json({ ok: true });
    }
    // MULTI-CODE PATH
    if (Array.isArray(codes) && codes.length > 0) {
      const codesList = codes
        .map((c: unknown) => (typeof c === 'string' ? c.trim() : ''))
        .filter((c: string) => c.length > 0);

      if (codesList.length === 0) {
        return NextResponse.json({ error: 'Nie podano poprawnych kodów rabatowych' }, { status: 400 });
      }

      const now = new Date().toISOString();
      type CouponRow = {
        id: string;
        amount: number;
        state: number;
        expiration_date?: string;
        per_user_limit?: number;
        affiliation_of?: string | null;
        use_limit?: number;
        vouchers_amount_left?: number;
        voucher_amount_left?: number;
        coupons_types?: { coupon_type?: string } | null;
        discounted_product?: { id: string; name?: string } | null;
        discounted_products?: Array<{ id: string; name?: string }> | null;
        eligibleCount?: number;
        code?: string;
      };

      const selectedCoupons: CouponRow[] = [];

      const normalizeCouponRow = (r: unknown): CouponRow => {
        const row = r as Record<string, unknown>;
        const coupons_types = (row['coupons_types'] ?? null) as
          | { coupon_type?: string }
          | Array<{ coupon_type?: string }>
          | null;
        const normalized: CouponRow = {
          id: String(row['id'] as string),
          amount: Number(row['amount'] as number),
          state: Number(row['state'] as number),
          expiration_date: row['expiration_date'] as string | undefined,
          per_user_limit: (row['per_user_limit'] as number | undefined) ?? undefined,
          affiliation_of: (row['affiliation_of'] as string | null | undefined) ?? null,
          use_limit: (row['use_limit'] as number | undefined) ?? undefined,
          voucher_amount_left: (row['voucher_amount_left'] as number | undefined) ?? undefined,
          coupons_types: Array.isArray(coupons_types)
            ? (coupons_types[0] ?? { coupon_type: undefined })
            : (coupons_types ?? null),
          discounted_product: (row['discounted_product'] as { id: string; name?: string } | null | undefined) ?? null,
          discounted_products:
            (row['discounted_products'] as Array<{ id: string; name?: string }> | null | undefined) ?? null,
          eligibleCount: (row['eligibleCount'] as number | undefined) ?? undefined,
          code: row['code'] as string | undefined,
        };
        return normalized;
      };

      // Resolve each code similarly to single-code logic
      for (const c of codesList) {
        const { data: rows, error } = await supabase
          .from('coupons')
          .select(
            `
            id,  
            amount,
            state,
            code,
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
          .eq('code', c);

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const list = rows ?? [];
        if (list.length === 0) {
          return NextResponse.json({ error: `Kod rabatowy ${c} nie istnieje` }, { status: 404 });
        }

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
                        (sum: number, item: { product: string; quantity?: number; _type?: string }) =>
                          eligibleIds.includes(item.product) ? sum + (item.quantity ?? 1) : sum,
                        0
                      )
                    : 0
                  : 0;
              return { row: r, eligibleCount, eligibleIds };
            }
            return { row: r, eligibleCount: 1, eligibleIds: [] as string[] };
          })
          .sort((a, b) => b.eligibleCount - a.eligibleCount);

        const selected = scored.find((s) => s.eligibleCount > 0)?.row ?? scored[0]?.row ?? list[0];
        if (!selected) {
          return NextResponse.json({ error: `Kod rabatowy ${c} nie istnieje` }, { status: 404 });
        }

        // Individual validations mirroring single-code path
        if (
          selected?.affiliation_of &&
          Array.isArray(cart) &&
          cart.find((i: { _type: string }) => i._type !== 'course')
        ) {
          return NextResponse.json(
            { error: 'Afiliacyjny kod rabatowy jest dostępny tylko dla kursów' },
            { status: 400 }
          );
        }

        if (selected?.affiliation_of === userId) {
          return NextResponse.json({ error: 'Nie możesz użyć własnego kodu afiliacyjnego' }, { status: 400 });
        }

        if (selected?.expiration_date && selected.expiration_date < now) {
          return NextResponse.json({ error: `Kod ${c} jest przeterminowany` }, { status: 400 });
        }

        if (selected?.per_user_limit) {
          if (!userId)
            return NextResponse.json(
              { error: 'Musisz być zalogowany, aby użyć tego kodu rabatowego' },
              { status: 401 }
            );

          const { count } = await supabase
            .from('coupons_uses')
            .select('*', { count: 'exact', head: true })
            .eq('used_coupon', selected.id)
            .eq('used_by', userId);

          if (typeof count === 'number' && count >= selected.per_user_limit) {
            return NextResponse.json({ error: `Osiągnięto limit użyć kodu ${c}` }, { status: 400 });
          }
        }

        if (selected?.use_limit) {
          const { count } = await supabase
            .from('coupons_uses')
            .select('*', { count: 'exact', head: true })
            .eq('used_coupon', selected.id);

          if (typeof count === 'number' && count >= selected.use_limit) {
            return NextResponse.json({ error: `Osiągnięto limit użyć kodu ${c}` }, { status: 400 });
          }
        }

        // Compute and attach eligibleCount for FIXED PRODUCT
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
            return NextResponse.json({ error: `Kod ${c} nie dotyczy żadnego produktu w koszyku` }, { status: 400 });
          }
          (selected as unknown as { eligibleCount?: number }).eligibleCount = eligibleCount;
        }

        // Override amount for affiliate coupons to always be 50 PLN
        if (selected?.affiliation_of) {
          selected.amount = 5000;
        }

        const normalized = normalizeCouponRow(selected);
        selectedCoupons.push(normalized);
      }

      // Cross-coupon rules (v1)
      const typeOf = (c: CouponRow) => c?.coupons_types?.coupon_type as string | undefined;
      const vouchers = selectedCoupons.filter((c) => typeOf(c) === 'VOUCHER');
      if (vouchers.length > 1) {
        return NextResponse.json({ error: 'W koszyku można użyć tylko jednego vouchera' }, { status: 400 });
      }

      const cartWide = selectedCoupons.filter((c) => {
        const t = typeOf(c);
        return t === 'PERCENTAGE' || t === 'FIXED CART';
      });
      if (cartWide.length > 0 && selectedCoupons.length > 1) {
        return NextResponse.json({ error: 'Nie można łączyć kodów koszykowych z innymi zniżkami' }, { status: 400 });
      }

      const hasAffiliate = selectedCoupons.some((c) => !!c.affiliation_of);
      if (hasAffiliate && selectedCoupons.length > 1) {
        return NextResponse.json({ error: 'Kod afiliacyjny nie łączy się z innymi zniżkami' }, { status: 400 });
      }

      // Overlap detection for FIXED PRODUCT coupons
      const fixedProductCoupons = selectedCoupons.filter((c) => typeOf(c) === 'FIXED PRODUCT');
      if (fixedProductCoupons.length > 1) {
        const getIds = (c: CouponRow) =>
          Array.isArray(c?.discounted_products) && c.discounted_products.length > 0
            ? c.discounted_products.map((p: { id: string }) => p.id)
            : c?.discounted_product?.id
              ? [c.discounted_product.id]
              : [];
        const used = new Set<string>();
        for (const c of fixedProductCoupons) {
          const ids = getIds(c);
          for (const id of ids) {
            if (used.has(id)) {
              return NextResponse.json(
                { error: 'Kody nakładają się na te same produkty – usuń jeden z nich' },
                { status: 400 }
              );
            }
            used.add(id);
          }
        }
      }

      // Submit path: keep same course-only check already done per coupon; just return coupons
      return NextResponse.json({ coupons: selectedCoupons });
    }

    // SINGLE-CODE PATH (legacy)
    const { data: rows, error } = await supabase
      .from('coupons')
      .select(
        `
        id,  
        amount,
        state,
        code,
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
      if ((selected.voucher_amount_left ?? 0) <= 0) {
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
