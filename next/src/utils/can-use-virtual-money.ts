import type { ProductCard } from '@/global/types';

/**
 * Check if virtual money (loyalty points) can be used with the current cart items.
 * Virtual money can ONLY be used for courses and bundles - NOT for physical products or vouchers.
 *
 * @param fetchedItems - Array of cart items with their full product details
 * @returns boolean - true if cart contains ONLY courses/bundles, false otherwise
 */
export function canUseVirtualMoney(fetchedItems: ProductCard[] | null | undefined): boolean {
  if (!fetchedItems || fetchedItems.length === 0) {
    return false;
  }

  // Check if ALL items are either courses or bundles
  // If any item is a physical product or voucher, virtual money cannot be used
  return fetchedItems.every((item) => item._type === 'course' || item._type === 'bundle');
}

/**
 * Get a user-friendly message explaining why virtual money cannot be used
 *
 * @param fetchedItems - Array of cart items with their full product details
 * @returns string | null - Error message if virtual money cannot be used, null otherwise
 */
export function getVirtualMoneyRestrictionMessage(fetchedItems: ProductCard[] | null | undefined): string | null {
  if (!fetchedItems || fetchedItems.length === 0) {
    return 'Koszyk jest pusty';
  }

  if (canUseVirtualMoney(fetchedItems)) {
    return null;
  }

  const hasPhysicalProducts = fetchedItems.some((item) => item._type === 'product');
  const hasVouchers = fetchedItems.some((item) => item._type === 'voucher');

  if (hasPhysicalProducts && hasVouchers) {
    return 'Wirtualne złotówki można wykorzystać tylko przy zakupie kursów. W koszyku znajdują się produkty fizyczne i vouchery.';
  } else if (hasPhysicalProducts) {
    return 'Wirtualne złotówki można wykorzystać tylko przy zakupie kursów. W koszyku znajdują się produkty fizyczne.';
  } else if (hasVouchers) {
    return 'Wirtualne złotówki można wykorzystać tylko przy zakupie kursów. W koszyku znajdują się vouchery.';
  }

  return 'Wirtualne złotówki można wykorzystać tylko przy zakupie kursów.';
}
