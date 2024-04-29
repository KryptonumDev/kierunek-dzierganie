'use server';
import { NextResponse } from 'next/server';
import { P24 } from '@ingameltd/node-przelewy24';
import { createClient } from '@/utils/supabase-admin';
import { sanityPatchQuantity, sanityPatchQuantityInVariant } from '@/utils/sanity.fetch';

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const { sessionId, amount, currency, orderId } = await request.json();

    const p24 = new P24(
      Number(process.env.P24_MERCHANT_ID!),
      Number(process.env.P24_POS_ID!),
      process.env.P24_REST_API_KEY!,
      process.env.P24_CRC!,
      {
        sandbox: !!process.env.SANDBOX,
      }
    );

    // verify transaction in P24 service
    await p24.verifyTransaction({
      amount,
      currency,
      orderId,
      sessionId,
    });

    const { data, error } = await supabase
      .from('orders')
      .update({
        paid_at: new Date(),
        payment_id: sessionId,
        status: 2,
      })
      .eq('id', sessionId)
      .select(
        `
        created_at,
        user_id,
        used_discount,
        used_virtual_money,
        products
      `
      )
      .single();

    // check if discount was used
    error: if (data && data.used_discount?.id) {
      // create new coupons_uses record
      const newRecord = await supabase.from('coupons_uses').insert({
        used_at: data.created_at,
        used_coupon: data.used_discount.id,
        used_by: data.user_id,
      });

      // check if error occurred during insert
      if (newRecord.error) break error;

      // get information about affiliation of used discount
      const couponData = await supabase
        .from('coupons')
        .select('affiliation_of')
        .eq('id', data.used_discount.id)
        .single();

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

    data?.products.array.forEach(
      async (product: {
        quantity: number;
        type: string;
        variantId: string;
        id: string;
        courses: null | { _id: string }[];
      }) => {
        // create courses_progress record for each course
        if (product.courses) {
          const newCourses = product.courses.map((el) => ({
            owner_id: data.user_id,
            course_id: el._id,
            progress: null,
          }));
          await supabase.from('courses_progress').insert(newCourses);
        }

        // TODO: maybe move this to create step??
        if (product.variantId) {
          // decrease quantity of chosen variant of variable product
          await sanityPatchQuantityInVariant(product.id, product.variantId, product.quantity);
        } else if (product.type === 'product') {
          // decrease quantity of each physical product
          await sanityPatchQuantity(product.id, product.quantity);
        }
      }
    );

    if (error) throw new Error(error.message);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
