'use client';
import { useCart } from 'react-use-cart';
import Button from '../Button';
import styles from './AddToCart.module.scss';
import type { Props } from './AddToCart.types';
import { toast } from 'react-toastify';

// const gtag: Gtag.Gtag = function () {
//   // eslint-disable-next-line prefer-rest-params
//   window.dataLayer?.push(arguments);
// };

const AddToCart = ({ id, variant, disabled, quantity = 1, voucherData }: Props) => {
  const { addItem, inCart, updateItem } = useCart();
  const productId = variant ? id + 'variant:' + variant : id;

  const addItemToCart = () => {
    if (voucherData?.amount && inCart(productId)) {
      updateItem(productId, { id: productId, product: id, variant, price: 0, voucherData: voucherData, quantity: 1 });
    } else {
      // gtag('event', 'add_to_cart', {
      //   currency: 'PLN',
      //   value: 100,
      //   items: [
      //     {
      //       id: data._id,
      //       name: data.name,
      //       price: 100,
      //     },
      //   ],
      // });

      addItem({ id: productId, product: id, variant, price: 0, voucherData: voucherData }, quantity);
    }
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
