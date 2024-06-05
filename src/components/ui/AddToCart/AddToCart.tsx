'use client';
import { useCart } from 'react-use-cart';
import Button from '../Button';
import styles from './AddToCart.module.scss';
import type { Props } from './AddToCart.types';
import { toast } from 'react-toastify';

const AddToCart = ({ id, variant, disabled, quantity = 1 }: Props) => {
  const { addItem } = useCart();
  const productId = variant ? (id + 'variant:' + variant) : id;

  const addItemToCart = () => {
    addItem({ id: productId, product: id, variant, price: 0 }, quantity);
    toast('Produkt dodany do koszyka');
  };

  return (
    <Button
      className={styles['addToCart']}
      disabled={disabled || quantity === 0}
      onClick={addItemToCart}
    >
      {quantity === 0 ? 'Produkt niedostępny' : 'Dodaj do koszyka'}
    </Button>
  );
};

export default AddToCart;
