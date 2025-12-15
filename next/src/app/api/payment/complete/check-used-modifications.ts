import { createClient } from '@/utils/supabase-admin';
import { addPoints, spendPoints } from '@/utils/virtual-wallet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkUsedModifications(data: any) {
  const supabase = createClient();

  // check if discount was used
  // New path: array of discounts (multi-coupon)
  const hasMulti = data && Array.isArray(data.used_discounts) && data.used_discounts.length > 0;
  const hasLegacy = data && data.used_discount?.id;

  if (hasMulti) {
    for (const d of data.used_discounts) {
      // Idempotency: skip if this order+coupon already recorded
      const { count: alreadyExists } = await supabase
        .from('coupons_uses')
        .select('*', { head: true, count: 'exact' })
        .eq('used_coupon', d.id)
        .eq('used_at', data.created_at);
      if (typeof alreadyExists === 'number' && alreadyExists > 0) {
        continue;
      }

      let usedAmount: number | null = null;
      if (d?.type === 'VOUCHER') {
        const totalAmount =
          data.products.array.reduce(
            (acc: number, product: { price: number; discount: number | null; quantity: number }) =>
              acc + (product.discount ?? product.price) * product.quantity,
            0
          ) +
          (data.shipping_method?.price ?? 0) -
          (data.used_virtual_money ?? 0);

        // d.amount for vouchers is already the consumed amount at order creation time
        usedAmount = d.amount > totalAmount ? totalAmount : d.amount;

        const voucher = await supabase
          .from('coupons')
          .select(
            `
            voucher_amount_left
          `
          )
          .eq('id', d.id)
          .single();

        await supabase
          .from('coupons')
          .update({
            voucher_amount_left: Math.max(0, (voucher.data?.voucher_amount_left ?? 0) - (usedAmount ?? 0)),
          })
          .eq('id', d.id);
      }

      await supabase.from('coupons_uses').insert({
        used_at: data.created_at,
        used_coupon: d.id,
        used_by: data.user_id || null,
        voucher_used_amount: usedAmount,
      });

      const couponData = await supabase.from('coupons').select('affiliation_of').eq('id', d.id).single();
      if (couponData.data && couponData.data.affiliation_of) {
        await addPoints(supabase, couponData.data.affiliation_of, 50, 'Prowizja za polecenie', data.id);
      }
    }
  }

  // Legacy path: single discount
  // Guard against double-processing orders that also have used_discounts populated
  error: if (!hasMulti && hasLegacy) {
    // create new coupons_uses record

    let usedAmount = null;

    if (data.used_discount?.type === 'VOUCHER') {
      const totalAmount =
        data.products.array.reduce(
          (acc: number, product: { price: number; discount: number | null; quantity: number }) =>
            acc + (product.discount ?? product.price) * product.quantity,
          0
        ) +
        (data.shipping_method?.price ?? 0) -
        (data.used_virtual_money ?? 0);

      usedAmount = data.used_discount.amount > totalAmount ? totalAmount : data.used_discount.amount;

      // Idempotency: skip if this order+coupon already recorded
      const { count: alreadyExists } = await supabase
        .from('coupons_uses')
        .select('*', { head: true, count: 'exact' })
        .eq('used_coupon', data.used_discount.id)
        .eq('used_at', data.created_at);
      if (typeof alreadyExists === 'number' && alreadyExists > 0) break error;

      const voucher = await supabase
        .from('coupons')
        .select(
          `
            voucher_amount_left
          `
        )
        .eq('id', data.used_discount.id)
        .single();

      const updateVoucherData = await supabase
        .from('coupons')
        .update({
          voucher_amount_left: Math.max(0, (voucher.data?.voucher_amount_left ?? 0) - (usedAmount ?? 0)),
        })
        .eq('id', data.used_discount.id);

      console.log(updateVoucherData);
    }

    const newRecord = await supabase.from('coupons_uses').insert({
      used_at: data.created_at,
      used_coupon: data.used_discount.id,
      used_by: data.user_id || null, // Allow null for guest orders
      voucher_used_amount: usedAmount,
    });

    // check if error occurred during insert
    if (newRecord.error) break error;

    // get information about affiliation of used discount
    const couponData = await supabase.from('coupons').select('affiliation_of').eq('id', data.used_discount.id).single();

    // check if used discount was affiliated by some user
    if (couponData.data && couponData.data.affiliation_of) {
      // add 50zł to affiliation discount code owner
      await addPoints(supabase, couponData.data.affiliation_of, 50, 'Prowizja za polecenie', data.id);
    }
  }

  // check if virtual money was used (skip for guest orders)
  if (data && data.used_virtual_money && data.user_id) {
    // decrease user virtual money by used amount
    await spendPoints(supabase, data.user_id, data.used_virtual_money, data.id);
  } else if (data && data.used_virtual_money && !data.user_id) {
    console.log('Skipping virtual money operations for guest order');
  }
}
