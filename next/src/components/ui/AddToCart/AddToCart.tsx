'use client';
import { useCart } from 'react-use-cart';
import Button from '../Button';
import styles from './AddToCart.module.scss';
import type { Props } from './AddToCart.types';
import { toast } from 'react-toastify';

const gtag: Gtag.Gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
};

const AddToCart = ({ id, variant, disabled, quantity = 1, voucherData, data }: Props) => {
  const { addItem, inCart, updateItem } = useCart();
  const productId = variant ? id + 'variant:' + variant : id;

  const addItemToCart = () => {
    // Prevent duplicate adds for non-quantifiable items (courses, bundles, vouchers)
    const isNonQuantifiable = data._type === 'course' || data._type === 'bundle' || data._type === 'voucher';

    if (isNonQuantifiable && inCart(productId)) {
      // Normalize to quantity=1 and inform user
      updateItem(productId, { id: productId, product: id, variant, price: 0, voucherData: voucherData, quantity: 1 });
      toast('Ten produkt jest już w koszyku');
      return;
    }

    if (voucherData?.amount && inCart(productId)) {
      updateItem(productId, { id: productId, product: id, variant, price: 0, voucherData: voucherData, quantity: 1 });
    } else {
      if (typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', {
          content_ids: [data._id],
          content_name: data.name,
          content_type: 'product',
          value: data.price! / 100,
          currency: 'PLN',
        });
      }
      gtag('event', 'add_to_cart', {
        currency: 'PLN',
        value: data.discount ? (data.discount / 100) * quantity : (data.price! / 100) * quantity,
        items: [
          {
            id: data._id,
            name: data.name,
            discount: data.discount ? (data.price! - data.discount) / 100 : undefined,
            price: data.price! / 100,
            item_variant: data.variant,
            item_category: data._type,
            item_category2: data.basis,
            quantity: quantity,
          },
        ],
      });

      addItem({ id: productId, product: id, variant, price: 0, voucherData: voucherData }, isNonQuantifiable ? 1 : quantity);
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
