import Button from '../Button';
import styles from './AddToCart.module.scss';
import type { Props } from './AddToCart.types';

const AddToCart = ({ id, type, variant, disabled }: Props) => {
  console.log('variant', variant);
  console.log('type', type);
  console.log('id', id);
  return (
    <Button
      className={styles['addToCart']}
      disabled={disabled}
    >
      Dodaj do koszyka
    </Button>
  );
};

export default AddToCart;
