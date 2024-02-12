import Button from '../Button';
import styles from './AddToCart.module.scss';
import type { Props } from './AddToCart.types';

const AddToCart = ({ id, type, variant, disabled }: Props) => {
  console.log(id, type, variant, disabled);
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
