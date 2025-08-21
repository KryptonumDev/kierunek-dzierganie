import type { ProductCard } from '@/global/types';

export type CartValidationResult = {
  canCheckoutAsGuest: boolean;
  hasPhysicalOnly: boolean;
  hasDigitalOnly: boolean;
  hasMixedCart: boolean;
  isEmpty: boolean;
  digitalProductTypes: string[];
  physicalProductCount: number;
  digitalProductCount: number;
  guestCheckoutBlockedReason?: string;
};

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
      hasDigitalOnly: false,
      hasMixedCart: false,
      isEmpty: true,
      digitalProductTypes: [],
      physicalProductCount: 0,
      digitalProductCount: 0,
      guestCheckoutBlockedReason: 'Koszyk jest pusty',
    };
  }

  const physicalProducts = cartItems.filter((item) => item._type === 'product');
  const digitalProducts = cartItems.filter(
    (item) => item._type === 'course' || item._type === 'bundle' || item._type === 'voucher'
  );

  const physicalProductCount = physicalProducts.length;
  const digitalProductCount = digitalProducts.length;
  const digitalProductTypes = Array.from(new Set(digitalProducts.map((item) => item._type)));

  const hasPhysicalOnly = physicalProductCount > 0 && digitalProductCount === 0;
  const hasDigitalOnly = physicalProductCount === 0 && digitalProductCount > 0;
  const hasMixedCart = physicalProductCount > 0 && digitalProductCount > 0;

  let guestCheckoutBlockedReason: string | undefined;

  if (hasDigitalOnly) {
    guestCheckoutBlockedReason = 'Produkty cyfrowe wymagają utworzenia konta';
  } else if (hasMixedCart) {
    guestCheckoutBlockedReason = 'Koszyk zawiera produkty cyfrowe wymagające utworzenia konta';
  }

  return {
    canCheckoutAsGuest: hasPhysicalOnly,
    hasPhysicalOnly,
    hasDigitalOnly,
    hasMixedCart,
    isEmpty: false,
    digitalProductTypes,
    physicalProductCount,
    digitalProductCount,
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

  if (validation.hasDigitalOnly) {
    const productTypes = validation.digitalProductTypes
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
    return 'Twój koszyk zawiera produkty cyfrowe wymagające utworzenia konta.';
  }

  return validation.guestCheckoutBlockedReason || 'Zakup jako gość nie jest dostępny';
};
