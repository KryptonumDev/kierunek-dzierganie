import type { Discount } from '@/global/types';

export function calculateDiscountAmount(price: number, discount: Discount) {
  if (discount.type === 'PERCENTAGE') {
    return -price * (discount.amount / 100);
  }

  if (discount.type === 'FIXED CART' || discount.type === 'FIXED PRODUCT') {
    return -discount.amount;
  }

  return 0;
}
