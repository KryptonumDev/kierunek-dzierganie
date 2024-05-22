import type { Discount } from '@/global/types';

export function calculateDiscountAmount(price: number, discount: Discount) {
  if (discount.type === 'PERCENTAGE') {
    return -price * (discount.amount / 100);
  }

  if (discount.type === 'FIXED CART') {
    return -discount.amount;
  }

  return 0;
}
