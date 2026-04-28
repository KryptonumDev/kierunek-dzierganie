import type { Discount } from '@/global/types';
import { getNonDeliveryDiscounts } from '@/utils/delivery-discount';

type OrderProductLine = {
  price?: number | null;
  discount?: number | null;
  quantity?: number | null;
};

type ShippingLike = {
  price: number;
} | null | undefined;

type OrderDisplaySummaryInput = {
  amount: number;
  products: {
    array?: OrderProductLine[] | null;
  };
  shippingMethod?: ShippingLike;
  shipping_method?: ShippingLike;
  virtualMoney?: number | null;
  used_virtual_money?: number | null;
  discount?: Discount | null;
  discounts?: Discount[] | null;
  used_discount?: Discount | null;
  used_discounts?: Discount[] | null;
};

export function getOrderLineUnitPrice(item: OrderProductLine): number {
  return typeof item.discount === 'number' ? item.discount : (item.price ?? 0);
}

export function getOrderDiscounts(order: OrderDisplaySummaryInput): Discount[] {
  if (Array.isArray(order.used_discounts) && order.used_discounts.length > 0) return order.used_discounts;
  if (Array.isArray(order.discounts) && order.discounts.length > 0) return order.discounts;
  if (order.used_discount) return [order.used_discount];
  if (order.discount) return [order.discount];
  return [];
}

export function getOrderDisplaySummary(order: OrderDisplaySummaryInput) {
  const items = order.products.array ?? [];
  const totalItemsCount = items.reduce((acc, item) => acc + (item.quantity ?? 0), 0);
  const productsSubtotal = items.reduce((acc, item) => acc + getOrderLineUnitPrice(item) * (item.quantity ?? 0), 0);
  const shippingCents = order.shippingMethod?.price ?? order.shipping_method?.price ?? 0;
  const virtualMoneyUnits = order.virtualMoney ?? order.used_virtual_money ?? 0;
  const virtualMoneyCents = Math.max(0, virtualMoneyUnits * 100);
  const discounts = getNonDeliveryDiscounts(getOrderDiscounts(order));
  const baseBeforeDiscounts = productsSubtotal + shippingCents - virtualMoneyCents;
  const discountCents = discounts.length > 0 ? Math.min(0, order.amount - baseBeforeDiscounts) : 0;

  return {
    totalItemsCount,
    productsSubtotal,
    shippingCents,
    virtualMoneyCents,
    discounts,
    discountCents,
    totalCents: order.amount,
    hasDiscounts: discounts.length > 0,
    discountLabel: discounts.length === 1 ? `Kupon: ${discounts[0]!.code}` : 'Kupony',
  };
}
