import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import sanityFetch from './sanity.fetch';
import type { ProductCard } from '@/global/types';
import { PRODUCT_CARD_QUERY } from 'src/global/constants';

export const useCartItems = () => {
  const { items: rawCart, updateItemQuantity, updateItem, removeItem } = useCart();
  const [fetchedItems, setFetchedItems] = useState<ProductCard[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const res = await sanityFetch<ProductCard[]>({
          query: `
            *[(_type == 'product' || _type == 'course' || _type == 'bundle') && _id in $id]{
              ${PRODUCT_CARD_QUERY}
            }
          `,
          params: {
            id: rawCart?.map((el) => el.product) || [],
          },
        });

        const newArr = rawCart
          .filter((el) => el.quantity && Number(el.quantity) > 0)
          .filter((el) => {
            const item = res.find((item) => item._id === el.product)!;

            if (item._type === 'course' || item._type === 'bundle') return true;

            const variant = item.variants?.find((v) => v._id === el.variant) || null;

            if (variant) {
              return variant.countInStock >= el.quantity!;
            }

            return item.countInStock! >= el.quantity!;
          })
          .filter((el) => res.find((item) => item._id === el.product))
          .map((el) => {
            const item = res.find((item) => item._id === el.product)!;

            const variant = item.variants?.find((v) => v._id === el.variant) || null;

            // check if quantity is not higher than countInStock
            const quantity = variant
              ? Math.min(el.quantity!, variant.countInStock)
              : Math.min(el.quantity!, item.countInStock!);

            return {
              ...item,
              quantity: quantity,
              price: variant ? variant.price! : item.price!,
              discount: variant ? variant.discount : item.discount,
              variant: variant,
              variants: variant ? item.variants : [],
            };
          });

        rawCart.forEach((el) => {
          if (
            !res.find((item) => item._id === el.product) || // check if product still exists
            !newArr.find((item) => item._id === el.product) // check if product isn't filtrated in newArr
          ) {
            removeItem(el.id);
          }
        });

        setFetchedItems(newArr);
      } catch (error) {
        console.error(error);
        // TODO: handle error
      } finally {
        setLoading(false);
      }
    };
    if (rawCart?.length > 0 && fetchedItems?.length !== rawCart?.length) {
      fetchCartItems();
    } else if (fetchedItems) {
      // revalidate quantity
      const newArr = fetchedItems
        .filter((_, i) => rawCart[i]?.quantity && rawCart[i]!.quantity! > 0)
        .map((el) => {
          const itemInRawCart = rawCart.find((item) => {
            const productId = el.variant ? el._id + 'variant:' + el.variant._id : el._id;
            return item.id === productId;
          })!;

          return {
            ...el,
            quantity: itemInRawCart.quantity!,
          };
        });

      setFetchedItems(newArr);
      setLoading(false);
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCart]);

  return { cart: rawCart, fetchedItems, updateItemQuantity, updateItem, removeItem, loading };
};
