import type { Discount } from '@/global/types';

export function calculateDiscountAmount(price: number, discount: Discount, delivery: number | null | undefined) {
  if (discount.type === 'PERCENTAGE') {
    return -price * (discount.amount / 100);
  }

  if (discount.type === 'FIXED CART' || discount.type === 'VOUCHER') {
    return discount.amount > price + (delivery ?? 0) ? -(price + (delivery ?? 0)) : -discount.amount;
  }

  if (discount.type === 'FIXED PRODUCT') {
    return discount.amount > price ? -price : -discount.amount;
  }

  if (discount.type === 'DELIVERY' && delivery) {
    return -delivery;
  }

  return 0;
}
