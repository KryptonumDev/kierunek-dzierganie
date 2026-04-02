import type { ProductCard } from '@/global/types';

export type CartValidationResult = {
  canCheckoutAsGuest: boolean;
  hasPhysicalOnly: boolean;
  hasAccountRequiredOnly: boolean;
  hasMixedCart: boolean;
  isEmpty: boolean;
  accountRequiredProductTypes: string[];
  physicalProductCount: number;
  accountRequiredProductCount: number;
  guestCheckoutBlockedReason?: string;
};

/**
 * Guest checkout is based on account eligibility, not on delivery need.
 * Courses, bundles, and vouchers still require an account even if some of them
 * may now participate in the shipping flow.
 */
export const isGuestCheckoutEligibleItem = (item: Pick<ProductCard, '_type'>): boolean => item._type === 'product';
export const isAccountRequiredItem = (item: Pick<ProductCard, '_type'>): boolean =>
  item._type === 'course' || item._type === 'bundle' || item._type === 'voucher';

/**
 * Validates cart contents to determine if guest checkout is allowed
 * Guest checkout is only permitted for carts containing EXCLUSIVELY physical products
 *
 * @param cartItems - Array of products in the cart
 * @returns CartValidationResult with validation details
 */
export const validateGuestCart = (cartItems: ProductCard[]): CartValidationResult => {
  if (!cartItems || cartItems.length === 0) {
    return {
      canCheckoutAsGuest: false,
      hasPhysicalOnly: false,
      hasAccountRequiredOnly: false,
      hasMixedCart: false,
      isEmpty: true,
      accountRequiredProductTypes: [],
      physicalProductCount: 0,
      accountRequiredProductCount: 0,
      guestCheckoutBlockedReason: 'Koszyk jest pusty',
    };
  }

  const physicalProducts = cartItems.filter(isGuestCheckoutEligibleItem);
  const accountRequiredProducts = cartItems.filter(isAccountRequiredItem);

  const physicalProductCount = physicalProducts.length;
  const accountRequiredProductCount = accountRequiredProducts.length;
  const accountRequiredProductTypes = Array.from(new Set(accountRequiredProducts.map((item) => item._type)));

  const hasPhysicalOnly = physicalProductCount > 0 && accountRequiredProductCount === 0;
  const hasAccountRequiredOnly = physicalProductCount === 0 && accountRequiredProductCount > 0;
  const hasMixedCart = physicalProductCount > 0 && accountRequiredProductCount > 0;

  let guestCheckoutBlockedReason: string | undefined;

  if (hasAccountRequiredOnly) {
    guestCheckoutBlockedReason = 'Ten koszyk zawiera kursy, pakiety lub vouchery wymagające utworzenia konta';
  } else if (hasMixedCart) {
    guestCheckoutBlockedReason = 'Koszyk zawiera produkty wymagające utworzenia konta';
  }

  return {
    canCheckoutAsGuest: hasPhysicalOnly,
    hasPhysicalOnly,
    hasAccountRequiredOnly,
    hasMixedCart,
    isEmpty: false,
    accountRequiredProductTypes,
    physicalProductCount,
    accountRequiredProductCount,
    guestCheckoutBlockedReason,
  };
};

/**
 * Gets user-friendly message explaining why guest checkout is not available
 *
 * @param validation - Cart validation result
 * @returns Polish message explaining the restriction
 */
export const getGuestCheckoutBlockedMessage = (validation: CartValidationResult): string => {
  if (validation.isEmpty) {
    return 'Dodaj produkty do koszyka, aby kontynuować';
  }

  if (validation.hasAccountRequiredOnly) {
    const productTypes = validation.accountRequiredProductTypes
      .map((type) => {
        switch (type) {
          case 'course':
            return 'kursy';
          case 'bundle':
            return 'pakiety';
          case 'voucher':
            return 'vouchery';

          default:
            return type;
        }
      })
      .join(', ');

    return `${productTypes.charAt(0).toUpperCase() + productTypes.slice(1)} wymagają utworzenia konta.`;
  }

  if (validation.hasMixedCart) {
    return 'Twój koszyk zawiera kursy, pakiety lub vouchery wymagające utworzenia konta.';
  }

  return validation.guestCheckoutBlockedReason || 'Zakup jako gość nie jest dostępny';
};
