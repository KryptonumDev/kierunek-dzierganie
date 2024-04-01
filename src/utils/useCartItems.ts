import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import sanityFetch from './sanity.fetch';
import type { Product } from '@/global/types';
import { PRODUCT } from 'src/queries/PRODUCT';

export const useCartItems = () => {
  const { items: rawCart, updateItemQuantity, updateItem, removeItem } = useCart();
  const [fetchedItems, setFetchedItems] = useState<Product[] | null>(null);
  const [sum, setSum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const res = await sanityFetch<Product[]>({
          query: `
            *[_type== 'product' && _id in $id]{
              ${PRODUCT}
            }
          `,
          params: {
            id: rawCart?.map((el) => el.id) || [],
          },
        });
        let newSum = 0;
        const newArr = res
          .filter((_, i) => rawCart[i]?.quantity && Number(rawCart[i]?.quantity) > 0)
          .map((el, index) => {
            const itemQuantity = rawCart[index]!.quantity!;
            newSum += (el.discount || el.price) * itemQuantity;
            return {
              ...el,
              quantity: itemQuantity,
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
        .map((el, index) => {
          const itemQuantity = rawCart[index]!.quantity!;
          newSum += (el.discount || el.price) * itemQuantity;
          return {
            ...el,
            quantity: itemQuantity,
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
