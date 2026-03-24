import { dedicatedVoucher, voucher as generateVoucherPdf } from '@/utils/create-voucher';
import { formatPrice } from '@/utils/price-formatter';
import { generateRandomCode } from '@/utils/generate-random-code';
import { SupabaseClient } from '@supabase/supabase-js';

interface VoucherData {
  type: 'DIGITAL' | 'PHYSICAL';
  amount: number;
  dedication?: {
    from: string;
    to: string;
    message: string;
  };
}

interface VoucherProduct {
  type: 'voucher';
  voucherData: VoucherData;
  voucherBase64: string | null;
  voucherPending?: boolean;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderData = any;

/**
 * Creates voucher coupons in the database and generates PDFs for voucher products.
 * This function is called AFTER payment is confirmed to prevent orphaned coupons
 * when users click the payment button multiple times.
 * 
 * @param orderData - The order data containing products array
 * @param supabase - Supabase client instance
 * @returns Updated order data with voucherBase64 populated for voucher products
 */
export async function createVoucherCoupons(
  orderData: OrderData,
  supabase: SupabaseClient
): Promise<OrderData> {
  const products = orderData.products?.array;
  
  if (!products || products.length === 0) {
    return orderData;
  }

  // Check if there are any pending voucher products
  const hasVoucherProducts = products.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.type === 'voucher' && (p as VoucherProduct).voucherPending
  );

  if (!hasVoucherProducts) {
    return orderData;
  }

  console.log(`🎫 Creating voucher coupons for order ${orderData.id}`);

  // Process each product and create coupons for vouchers
  const updatedProducts = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products.map(async (product: any) => {
      if (product.type !== 'voucher' || !(product as VoucherProduct).voucherPending) {
        return product;
      }

      const voucherProduct = product as VoucherProduct;
      const voucherData = voucherProduct.voucherData;

      try {
        // Create coupon in database
        const { data: couponData, error: couponError } = await supabase
          .from('coupons')
          .insert({
            description: 'Voucher',
            type: 5,
            code: generateRandomCode(),
            state: 2,
            amount: voucherData.amount,
            voucher_amount_left: voucherData.amount,
            // Three months from now
            expiration_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          })
          .select('*')
          .single();

        if (couponError || !couponData) {
          console.error(`❌ Error creating voucher coupon for order ${orderData.id}:`, couponError?.message);
          return {
            ...voucherProduct,
            voucherBase64: null,
            voucherPending: false,
            voucherError: couponError?.message || 'Failed to create coupon',
          };
        }

        const code = couponData.code;
        const amount = formatPrice(voucherData.amount);
        const date = couponData.expiration_date;

        // Generate PDF with the coupon code
        const blob = voucherData.dedication
          ? await dedicatedVoucher({ code, date, amount, dedication: voucherData.dedication })
          : await generateVoucherPdf({ code, amount, date });

        console.log(`✅ Voucher coupon created: ${code} for order ${orderData.id}`);

        return {
          ...voucherProduct,
          voucherBase64: blob,
          voucherPending: false,
          voucherCode: code, // Store code for reference
        };
      } catch (error) {
        console.error(`❌ Unexpected error creating voucher for order ${orderData.id}:`, error);
        return {
          ...voucherProduct,
          voucherBase64: null,
          voucherPending: false,
          voucherError: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  // Update the order in database with the new products (including voucherBase64)
  const updatedOrderData = {
    ...orderData,
    products: {
      ...orderData.products,
      array: updatedProducts,
    },
  };

  const { error: updateError } = await supabase
    .from('orders')
    .update({ products: updatedOrderData.products })
    .eq('id', orderData.id);

  if (updateError) {
    console.error(`❌ Failed to update order ${orderData.id} with voucher data:`, updateError.message);
  } else {
    console.log(`✅ Order ${orderData.id} updated with voucher PDFs`);
  }

  return updatedOrderData;
}
