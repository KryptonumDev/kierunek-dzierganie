import { useEffect, useState } from 'react';
import { Item, useCart } from 'react-use-cart';
import sanityFetch from './sanity.fetch';

type Product = {
  _id: string;
  price: number;
  discount: number;
  name: string;
  slug: {
    current: string;
  };
  image: {
    asset: {
      altText: string;
      url: string;
      metadata: {
        lqip: string;
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
  };
};

export const useCartItems = () => {
  const { items: rawCart, updateItemQuantity, updateItem, removeItem } = useCart();
  const [cart, setCart] = useState<Item[] | null>(null);
  const [fetchedItems, setFetchedItems] = useState<Product[] | null>(null);
  const [sum, setSum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!rawCart) return;

    const fetchCartItems = async () => {
      setLoading(true);
      setCart(rawCart);
      try {
        const res = await sanityFetch<Product[]>({
          query: `
            *[_type== 'product']{
              price,
              discount,
              name,
              'slug': slug.current,
              basis,
              type,
              _type,
              gallery[0],
              variants{
                name,
                price,
                discount,
                gallery[0]
              }
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCart]);

  return { sum, cart, fetchedItems, updateItemQuantity, updateItem, removeItem, loading };
};
