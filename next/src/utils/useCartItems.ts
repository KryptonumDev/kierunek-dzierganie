import { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import sanityFetch from './sanity.fetch';
import type { ProductCard } from '@/global/types';
import { PRODUCT_CARD_QUERY } from 'src/global/constants';

export const useCartItems = () => {
  const { items: rawCart, updateItemQuantity, updateItem, removeItem, totalItems, totalUniqueItems } = useCart();
  const [fetchedItems, setFetchedItems] = useState<ProductCard[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const res = await sanityFetch<ProductCard[]>({
          query: `
            *[(_type == 'product' || _type == 'course' || _type == 'bundle' || _type == 'voucher') && _id in $id]{
              ${PRODUCT_CARD_QUERY}
              "related": *[_type == 'course' && references(^._id)][0]{
                _id,
                name
              }
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

            if (!item) {
              removeItem(el.id);
              return false;
            }

            if (item._type === 'course' || item._type === 'bundle' || item._type === 'voucher') return true;

            const variant = item.variants?.find((v) => v._id === el.variant) || null;

            if (variant) {
              // check if quantity is not higher than 0
              return variant.countInStock > 0;
            }

            // check if quantity is not higher than 0
            return item.countInStock! > 0;
          })
          .filter((el) => res.find((item) => item._id === el.product)) // double check if we delete some items on previous step
          .map((el) => {
            const item = res.find((item) => item._id === el.product)!;

            const variant = item.variants?.find((v) => v._id === el.variant) || null;

            // check if quantity is not higher than countInStock
            const quantity =
              item._type === 'course' || item._type === 'bundle' || item._type === 'voucher'
                ? 1
                : variant
                  ? Math.min(el.quantity!, variant.countInStock)
                  : Math.min(el.quantity!, item.countInStock!);

            if (item._type === 'voucher') {
              return {
                ...item,
                quantity: quantity,
                price: el.voucherData.amount!,
                voucherData: el.voucherData,
                variant: null,
                variants: null,
                needDelivery: el.voucherData.type === 'PHYSICAL',
              };
            }

            return {
              ...item,
              quantity: quantity,
              price: variant ? variant.price! : item.price!,
              discount: variant ? variant.discount : item.discount,
              variant: variant,
              variants: variant ? item.variants : [],
              needDelivery: item._type === 'product',
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
        .filter((el) => {
          return !!rawCart.find((item) => {
            const productId = el.variant ? el._id + 'variant:' + el.variant._id : el._id;
            return item.id === productId;
          })!;
        })
        .map((el) => {
          const itemInRawCart = rawCart.find((item) => {
            const productId = el.variant ? el._id + 'variant:' + el.variant._id : el._id;
            return item.id === productId;
          })!;

          // Apply the same quantity validation logic as in initial processing
          const validatedQuantity =
            el._type === 'course' || el._type === 'bundle' || el._type === 'voucher'
              ? 1
              : el.variant
                ? Math.min(itemInRawCart.quantity!, el.variant.countInStock)
                : Math.min(itemInRawCart.quantity!, el.countInStock!);

          return {
            ...el,
            quantity: validatedQuantity,
          };
        });

      rawCart.forEach((el) => {
        if (
          !newArr.find((item) => item._id === el.product) // check if product isn't filtrated in newArr
        ) {
          removeItem(el.id);
        }
      });

      setFetchedItems(newArr);
      setLoading(false);
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCart]);

  return {
    cart: rawCart,
    fetchedItems,
    updateItemQuantity,
    updateItem,
    removeItem,
    loading,
    totalItems,
    totalUniqueItems,
  };
};
