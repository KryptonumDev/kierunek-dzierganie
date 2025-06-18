'use client';
import { CartProvider } from 'react-use-cart';

export default function Cart({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
