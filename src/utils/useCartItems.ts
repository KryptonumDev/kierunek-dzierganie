import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import sanityFetch from './sanity.fetch';
import type { ProductCard } from '@/global/types';
import { PRODUCT_CARD_QUERY } from 'src/global/constants';

export const useCartItems = () => {
  const { items: rawCart, updateItemQuantity, updateItem, removeItem } = useCart();
  const [fetchedItems, setFetchedItems] = useState<ProductCard[] | null>(null);
  const [sum, setSum] = useState<number>(0);
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
            id: rawCart?.map((el) => el.id) || [],
          },
        });
        let newSum = 0;
        const newArr = res
          .filter((_, i) => rawCart[i]?.quantity && Number(rawCart[i]?.quantity) > 0)
          .map((el) => {
            const itemInRawCart = rawCart.find((item) => item.id === el._id)!;
            const variant = el.variants?.find((v) => v._id === itemInRawCart.variant) || null;
            const price = variant ? variant.discount || variant.price! : el.discount || el.price!;

            newSum += price * itemInRawCart.quantity!;
            return {
              ...el,
              quantity: itemInRawCart.quantity!,
              price: variant ? variant.price! : el.price!,
              discount: variant ? variant.discount : el.discount,
              variants: 'variants' in el ? el.variants : [],
            };
          });

        rawCart.forEach((el) => {
          if (!res.find((item) => item._id === el.id)) {
            removeItem(el.id);
          }
        });

        setFetchedItems(newArr);
        setSum(newSum);
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
      let newSum = 0;
      const newArr = fetchedItems
        .filter((_, i) => rawCart[i]?.quantity && rawCart[i]!.quantity! > 0)
        .map((el) => {
          const itemInRawCart = rawCart.find((item) => item.id === el._id)!;
          const variant = el.variants?.find((v) => v._id === itemInRawCart.variant) || null;
          const price = variant ? variant.discount || variant.price! : el.discount || el.price!;

          newSum += price * itemInRawCart.quantity!;
          return {
            ...el,
            quantity: itemInRawCart.quantity!,
            variants: 'variants' in el ? el.variants : [],
          };
        });

      setFetchedItems(newArr);
      setSum(newSum);
      setLoading(false);
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCart]);

  return { sum, cart: rawCart, fetchedItems, updateItemQuantity, updateItem, removeItem, loading };
};
