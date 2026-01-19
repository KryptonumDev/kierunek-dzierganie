import type { Discount } from '@/global/types';

/**
 * Calculate the discount amount for a single coupon.
 *
 * IMPORTANT: As of the category restrictions update, discounts NO LONGER apply to delivery.
 * Only FREE DELIVERY type coupons affect delivery costs.
 *
 * @param productsSubtotal - Total price of products (NOT including delivery)
 * @param discount - The discount object
 * @param eligibleSubtotal - For restricted coupons: subtotal of eligible items only (optional)
 * @returns Negative number representing the discount (e.g., -5000 for 50 PLN off)
 */
export function calculateDiscountAmount(
  productsSubtotal: number,
  discount: Discount,
  eligibleSubtotal?: number
): number {
  // Use eligible subtotal if provided (for category-restricted coupons)
  // Otherwise use full products subtotal
  const baseAmount = eligibleSubtotal ?? discount.eligibleSubtotal ?? productsSubtotal;

  if (discount.type === 'PERCENTAGE') {
    // Percentage of (eligible) products only - NO DELIVERY
    return -Math.floor((baseAmount * discount.amount) / 100);
  }

  if (discount.type === 'FIXED CART') {
    // Fixed amount capped at (eligible) products subtotal - NO DELIVERY
    return baseAmount >= discount.amount ? -discount.amount : -baseAmount;
  }

  if (discount.type === 'VOUCHER') {
    // Voucher capped at (eligible) products subtotal - NO DELIVERY
    return -Math.min(baseAmount, discount.amount ?? 0);
  }

  if (discount.type === 'FIXED PRODUCT') {
    // Per eligible line item (unchanged logic)
    const eligibleCount =
      typeof (discount as unknown as { eligibleCount?: number }).eligibleCount === 'number'
        ? (discount as unknown as { eligibleCount?: number }).eligibleCount!
        : 1;
    const aggregates = (discount as unknown as { aggregates?: boolean }).aggregates;
    const unitsUsed = aggregates === false ? Math.min(1, Math.max(0, eligibleCount)) : Math.max(0, eligibleCount);
    const total = discount.amount * unitsUsed;
    return total > productsSubtotal ? -productsSubtotal : -total;
  }

  if (discount.type === 'DELIVERY') {
    // This is the ONLY type that affects delivery
    // Returns 0 here - delivery discount should be handled separately in total calculation
    return 0;
  }

  return 0;
}

/**
 * Legacy version that includes delivery in calculation.
 * Used ONLY for displaying historical orders that were created before the update.
 *
 * @deprecated Use calculateDiscountAmount for new calculations
 */
export function calculateDiscountAmountLegacy(
  price: number,
  discount: Discount,
  delivery: number | null | undefined
): number {
  if (discount.type === 'PERCENTAGE') {
    // Apply percentage discount to products + delivery (old behavior)
    return -Math.floor(((price + (delivery ?? 0)) * discount.amount) / 100);
  }

  if (discount.type === 'FIXED CART' || discount.type === 'VOUCHER') {
    return discount.amount > price + (delivery ?? 0) ? -(price + (delivery ?? 0)) : -discount.amount;
  }

  if (discount.type === 'FIXED PRODUCT') {
    const eligibleCount =
      typeof (discount as unknown as { eligibleCount?: number }).eligibleCount === 'number'
        ? (discount as unknown as { eligibleCount?: number }).eligibleCount!
        : 1;
    const aggregates = (discount as unknown as { aggregates?: boolean }).aggregates;
    const unitsUsed = aggregates === false ? Math.min(1, Math.max(0, eligibleCount)) : Math.max(0, eligibleCount);
    const total = discount.amount * unitsUsed;
    return total > price ? -price : -total;
  }

  if (discount.type === 'DELIVERY' && delivery) {
    return -delivery;
  }

  return 0;
}
