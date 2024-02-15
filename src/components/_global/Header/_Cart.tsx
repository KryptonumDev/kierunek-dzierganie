'use client';
import { useCartItems } from '@/utils/useCartItems';
import styles from './Header.module.scss'

export default function Cart() {
  const { sum, cart, fetchedItems, updateItemQuantity, updateItem, removeItem, loading } = useCartItems();

  return <div className={styles['cart']}></div>;
}
