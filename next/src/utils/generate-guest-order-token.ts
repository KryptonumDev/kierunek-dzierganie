import { randomBytes } from 'crypto';
import type { Billing, Shipping, Discount, MapPoint } from '@/global/types';

/**
 * Generates a secure, unique token for guest orders
 *
 * @returns A cryptographically secure random token string
 */
export function generateGuestOrderToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Validates a guest order token format
 *
 * @param token - The token to validate
 * @returns True if the token format is valid
 */
export function validateGuestOrderToken(token: string): boolean {
  // Check if token is exactly 64 characters (32 bytes in hex)
  if (token.length !== 64) {
    return false;
  }

  // Check if token contains only hexadecimal characters
  return /^[0-9a-f]+$/i.test(token);
}

/**
 * Creates guest order data structure for backend processing
 *
 * @param orderData - The order data from the frontend
 * @returns Formatted guest order data ready for database insertion
 */
export function createGuestOrderData(orderData: {
  email: string;
  billing: Billing;
  shipping: Shipping;
  products: {
    array: Array<{
      type: string;
      id: string;
      name: string;
      price: number;
      quantity: number;
      discount: number;
      image: object;
      complexity: object | null;
      basis: string;
      variantId?: string;
      voucherData?: object;
    }>;
  };
  amount: number;
  shipping_method?: {
    data: string | MapPoint | null;
    name: string;
    price: number;
  };
  used_discount?: Discount | null;
  client_notes?: string;
  need_delivery: boolean;
  free_delivery: boolean;
}) {
  const guestOrderToken = generateGuestOrderToken();

  return {
    ...orderData,
    user_id: null, // Explicitly set to null for guest orders
    guest_email: orderData.email,
    guest_order_token: guestOrderToken,
    is_guest_order: true,
    used_virtual_money: null, // Guests cannot use virtual money
    payment_method: 'Przelewy24',
    status: orderData.amount <= 0 ? (orderData.need_delivery ? 2 : 3) : 1,
    paid_at: null,
    payment_id: null,
  };
}

/**
 * Checks if an order should be processed as a guest order
 *
 * @param input - The input data from the frontend
 * @returns True if this should be processed as a guest order
 */
export function isGuestOrder(input: { isGuestCheckout?: boolean; user_id?: string }): boolean {
  return input.isGuestCheckout === true && !input.user_id;
}
