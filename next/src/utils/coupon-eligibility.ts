/**
 * Coupon Category Restrictions Eligibility Utilities
 *
 * Helpers for checking if cart items are eligible for coupons
 * based on category restrictions (product_types, course_basis, product_categories).
 */

/**
 * Category restrictions structure from the database.
 * Null means no restrictions (all items eligible).
 */
export type CategoryRestrictions = {
  product_types?: ('course' | 'product' | 'bundle')[] | null;
  course_basis?: ('crocheting' | 'knitting')[] | null;
  product_categories?:
    | ('instruction' | 'materials' | 'other' | 'crocheting' | 'knitting')[]
    | null;
} | null;

/**
 * Minimal cart item shape needed for eligibility checks.
 */
export type CartItemForEligibility = {
  _type: 'course' | 'product' | 'bundle' | 'voucher' | string;
  basis?: string;
  _id?: string;
  product?: string; // cart item product ID (from react-use-cart)
  quantity?: number;
  price?: number;
  discount?: number;
};

/**
 * Check if a cart item is eligible for a coupon based on category restrictions.
 *
 * @param item - Cart item with _type and basis properties
 * @param restrictions - Category restrictions from the coupon
 * @returns true if item matches all applicable restrictions, false otherwise
 *
 * @example
 * // Coupon for crocheting courses only
 * const restrictions = { product_types: ['course'], course_basis: ['crocheting'] };
 * isItemEligibleForCoupon({ _type: 'course', basis: 'crocheting' }, restrictions); // true
 * isItemEligibleForCoupon({ _type: 'course', basis: 'knitting' }, restrictions); // false
 * isItemEligibleForCoupon({ _type: 'product', basis: 'crocheting' }, restrictions); // false
 */
export function isItemEligibleForCoupon(
  item: CartItemForEligibility,
  restrictions: CategoryRestrictions
): boolean {
  // No restrictions = everything eligible (backward compatible)
  if (!restrictions) return true;

  const { product_types, course_basis, product_categories } = restrictions;

  // Voucher items are never eligible for category-restricted coupons
  // (vouchers are a special product type that shouldn't receive discounts)
  if (item._type === 'voucher') {
    return false;
  }

  // 1. Check product type restriction
  if (product_types && product_types.length > 0) {
    if (!product_types.includes(item._type as 'course' | 'product' | 'bundle')) {
      return false;
    }
  }

  // 2. For courses/bundles: check course_basis if set
  if (
    (item._type === 'course' || item._type === 'bundle') &&
    course_basis &&
    course_basis.length > 0
  ) {
    if (!item.basis || !course_basis.includes(item.basis as 'crocheting' | 'knitting')) {
      return false;
    }
  }

  // 3. For physical products: check product_categories if set
  if (item._type === 'product' && product_categories && product_categories.length > 0) {
    if (
      !item.basis ||
      !product_categories.includes(
        item.basis as 'instruction' | 'materials' | 'other' | 'crocheting' | 'knitting'
      )
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Filter cart items to only those eligible for a coupon.
 *
 * @param items - Array of cart items
 * @param restrictions - Category restrictions from the coupon
 * @returns Array of eligible items
 */
export function filterEligibleItems<T extends CartItemForEligibility>(
  items: T[],
  restrictions: CategoryRestrictions
): T[] {
  return items.filter((item) => isItemEligibleForCoupon(item, restrictions));
}

/**
 * Calculate the subtotal of eligible items for a coupon.
 *
 * @param items - Array of cart items with price/discount and quantity
 * @param restrictions - Category restrictions from the coupon
 * @returns Sum of (discount ?? price) * quantity for eligible items
 */
export function calculateEligibleSubtotal(
  items: CartItemForEligibility[],
  restrictions: CategoryRestrictions
): number {
  return filterEligibleItems(items, restrictions).reduce((sum, item) => {
    const price = item.discount ?? item.price ?? 0;
    const quantity = item.quantity ?? 1;
    return sum + price * quantity;
  }, 0);
}

/**
 * Get IDs of eligible items for a coupon.
 *
 * @param items - Array of cart items
 * @param restrictions - Category restrictions from the coupon
 * @returns Array of item IDs (_id or product field)
 */
export function getEligibleItemIds(
  items: CartItemForEligibility[],
  restrictions: CategoryRestrictions
): string[] {
  return filterEligibleItems(items, restrictions)
    .map((item) => item._id || item.product || '')
    .filter(Boolean);
}

/**
 * Count eligible items for a coupon, considering quantities.
 *
 * @param items - Array of cart items
 * @param restrictions - Category restrictions from the coupon
 * @returns Total count (sum of quantities) of eligible items
 */
export function countEligibleItems(
  items: CartItemForEligibility[],
  restrictions: CategoryRestrictions
): number {
  return filterEligibleItems(items, restrictions).reduce(
    (count, item) => count + (item.quantity ?? 1),
    0
  );
}

/**
 * Check if any items in the cart are eligible for a coupon.
 *
 * @param items - Array of cart items
 * @param restrictions - Category restrictions from the coupon
 * @returns true if at least one item is eligible
 */
export function hasEligibleItems(
  items: CartItemForEligibility[],
  restrictions: CategoryRestrictions
): boolean {
  // No restrictions = always has eligible items (if cart is not empty)
  if (!restrictions) return items.length > 0;

  return items.some((item) => isItemEligibleForCoupon(item, restrictions));
}

/**
 * Generate user-friendly restriction description in Polish.
 *
 * @param restrictions - Category restrictions from the coupon
 * @returns Human-readable description or null if no restrictions
 *
 * @example
 * getRestrictionDescription({ product_types: ['course'], course_basis: ['crocheting'] });
 * // Returns: "Dotyczy: kursy, szydełkowanie"
 */
export function getRestrictionDescription(restrictions: CategoryRestrictions): string | null {
  if (!restrictions) return null;

  const parts: string[] = [];

  // Product type names
  if (restrictions.product_types?.length) {
    const typeNames: Record<string, string> = {
      course: 'kursy',
      product: 'produkty',
      bundle: 'pakiety kursów',
    };
    const typeDescriptions = restrictions.product_types
      .map((t) => typeNames[t] || t)
      .filter(Boolean);
    if (typeDescriptions.length > 0) {
      parts.push(typeDescriptions.join(' lub '));
    }
  }

  // Course basis names (for courses/bundles)
  if (restrictions.course_basis?.length) {
    const basisNames: Record<string, string> = {
      crocheting: 'szydełkowanie',
      knitting: 'dzierganie na drutach',
    };
    const basisDescriptions = restrictions.course_basis
      .map((b) => basisNames[b] || b)
      .filter(Boolean);
    if (basisDescriptions.length > 0) {
      parts.push(basisDescriptions.join(' lub '));
    }
  }

  // Product category names (for physical products)
  if (restrictions.product_categories?.length) {
    const catNames: Record<string, string> = {
      instruction: 'instrukcje',
      materials: 'pakiety materiałów',
      other: 'inne produkty',
      crocheting: 'produkty do szydełkowania',
      knitting: 'produkty do dziergania',
    };
    const catDescriptions = restrictions.product_categories
      .map((c) => catNames[c] || c)
      .filter(Boolean);
    if (catDescriptions.length > 0) {
      parts.push(catDescriptions.join(' lub '));
    }
  }

  return parts.length > 0 ? `Dotyczy: ${parts.join(', ')}` : null;
}

/**
 * Check if a coupon type supports category restrictions.
 * FIXED PRODUCT coupons use discounted_products instead.
 * FREE DELIVERY coupons don't have product restrictions.
 */
export function couponTypeSupportsRestrictions(couponType: string | undefined): boolean {
  if (!couponType) return false;

  const supportedTypes = ['PERCENTAGE', 'FIXED CART', 'VOUCHER'];
  return supportedTypes.includes(couponType);
}
