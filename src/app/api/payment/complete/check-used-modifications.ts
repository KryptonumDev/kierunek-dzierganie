import { createClient } from '@/utils/supabase-admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkUsedModifications(data: any) {
  const supabase = createClient();

  // check if discount was used
  error: if (data && data.used_discount?.id) {
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
          voucher_amount_left: voucher.data?.voucher_amount_left - usedAmount,
        })
        .eq('id', data.used_discount.id);

      console.log(updateVoucherData);
    }

    const newRecord = await supabase.from('coupons_uses').insert({
      used_at: data.created_at,
      used_coupon: data.used_discount.id,
      used_by: data.user_id,
      voucher_used_amount: usedAmount,
    });

    // check if error occurred during insert
    if (newRecord.error) break error;

    // get information about affiliation of used discount
    const couponData = await supabase.from('coupons').select('affiliation_of').eq('id', data.used_discount.id).single();

    // check if used discount was affiliated by some user
    if (couponData.data && couponData.data.affiliation_of) {
      // get current amount of affiliation discount code owner
      const prevValueResult = await supabase
        .from('virtual_wallet')
        .select('amount')
        .eq('owner', couponData.data.affiliation_of)
        .single();

      // check if error occurred during select of code owner
      if (prevValueResult.error) break error;

      // add 25zł to affiliation discount code owner
      await supabase
        .from('virtual_wallet')
        .update({
          amount: prevValueResult.data!.amount + 25,
        })
        .eq('owner', couponData.data.affiliation_of);
    }
  }

  // check if virtual money was used
  error: if (data && data.used_virtual_money) {
    // get current amount of user virtual money
    const prevValueResult = await supabase.from('virtual_wallet').select('amount').eq('owner', data.user_id).single();

    // check if error occurred during selecting of user virtual money
    if (prevValueResult.error) break error;

    // decrease user virtual money by used amount
    await supabase
      .from('virtual_wallet')
      .update({
        amount: prevValueResult.data!.amount - data.used_virtual_money,
      })
      .eq('owner', data.user_id);
  }
}
