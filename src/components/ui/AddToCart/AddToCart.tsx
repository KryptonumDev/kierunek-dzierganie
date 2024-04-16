import { useCart } from 'react-use-cart';
import Button from '../Button';
import styles from './AddToCart.module.scss';
import type { Props } from './AddToCart.types';

const AddToCart = ({ id, variant, disabled, quantity = 1 }: Props) => {
  const { addItem } = useCart();

  return (
    <Button
      className={styles['addToCart']}
      disabled={disabled}
      onClick={() => addItem({ id, variant, price: 0}, quantity)}
    >
      Dodaj do koszyka
    </Button>
  );
};

export default AddToCart;
