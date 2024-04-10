'use client';

import AddToCart from '@/components/ui/AddToCart';

export default function AddToCartButton({ id, type }: { id: string; type: string }) {
  return (
    <AddToCart
      id={id}
      type={type}
      disabled={false}
      quantity={1}
    />
  );
}
