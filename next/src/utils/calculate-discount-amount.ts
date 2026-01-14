import type { Discount } from '@/global/types';

export function calculateDiscountAmount(price: number, discount: Discount, delivery: number | null | undefined) {
  if (discount.type === 'PERCENTAGE') {
    // Apply percentage discount to products + delivery to match server-side calculation
    return -Math.floor(((price + (delivery ?? 0)) * discount.amount) / 100);
  }

  if (discount.type === 'FIXED CART' || discount.type === 'VOUCHER') {
    return discount.amount > price + (delivery ?? 0) ? -(price + (delivery ?? 0)) : -discount.amount;
  }

  if (discount.type === 'FIXED PRODUCT') {
    // Apply per eligible line item if available unless aggregates is false; clamp to cart price
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
