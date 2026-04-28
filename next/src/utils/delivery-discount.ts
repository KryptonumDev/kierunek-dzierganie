import type { CourseShippingMode, Discount } from '@/global/types';
import { shippingModeChargesDelivery } from '@/utils/resolve-shipping-mode';

export const DELIVERY_DISCOUNT_TYPE = 'DELIVERY';

type DiscountLike = Pick<Discount, 'type'>;

export function isDeliveryDiscount(discount?: DiscountLike | null): boolean {
  return discount?.type === DELIVERY_DISCOUNT_TYPE;
}

export function countDeliveryDiscounts(discounts?: DiscountLike[] | null): number {
  if (!Array.isArray(discounts)) return 0;
  return discounts.filter(isDeliveryDiscount).length;
}

export function hasDeliveryDiscount(discounts?: DiscountLike[] | null): boolean {
  return countDeliveryDiscounts(discounts) > 0;
}

export function getNonDeliveryDiscounts<T extends { type?: string }>(discounts?: T[] | null): T[] {
  if (!Array.isArray(discounts)) return [];
  return discounts.filter((discount) => discount.type !== DELIVERY_DISCOUNT_TYPE);
}

type ResolveDeliveryPricingInput = {
  discounts?: DiscountLike[] | null;
  freeShippingThreshold: number;
  needsDelivery: boolean;
  productsSubtotal: number;
  selectedShippingMethodPrice: number;
  shippingMode: CourseShippingMode;
};

export function resolveDeliveryPricing({
  discounts,
  freeShippingThreshold,
  needsDelivery,
  productsSubtotal,
  selectedShippingMethodPrice,
  shippingMode,
}: ResolveDeliveryPricingInput) {
  const chargesDelivery = needsDelivery && shippingModeChargesDelivery(shippingMode);
  const rawDeliveryAmount = chargesDelivery ? selectedShippingMethodPrice : 0;
  const thresholdFreeDelivery =
    chargesDelivery && freeShippingThreshold > 0 && productsSubtotal >= freeShippingThreshold;
  const deliveryCouponApplied = rawDeliveryAmount > 0 && !thresholdFreeDelivery && hasDeliveryDiscount(discounts);
  const deliveryAmount = deliveryCouponApplied || thresholdFreeDelivery ? 0 : rawDeliveryAmount;

  return {
    chargesDelivery,
    deliveryAmount,
    deliveryCouponApplied,
    freeDelivery: thresholdFreeDelivery || deliveryCouponApplied,
    hasDeliveryCoupon: hasDeliveryDiscount(discounts),
    rawDeliveryAmount,
    thresholdFreeDelivery,
  };
}
