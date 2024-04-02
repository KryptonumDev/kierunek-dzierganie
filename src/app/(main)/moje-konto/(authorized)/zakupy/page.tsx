import EmptyOrders from '@/components/_dashboard/EmptyOrders';
import ListingOrders from '@/components/_dashboard/ListingOrders';
import { Img_Query } from '@/components/ui/image';
import type { ImgType, Order, Product } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PRODUCT } from 'src/queries/PRODUCT';

type QueryProps = {
  global: {
    image_knitting: ImgType;
    image_crochet: ImgType;
  };
  products: Product[];
  orders: Order[];
};

export default async function Courses() {
  const { orders, global, products }: QueryProps = await query();

  return (
    <div>
      {orders.length > 0 ? (
        <ListingOrders
          orders={orders}
          products={products}
        />
      ) : (
        <EmptyOrders
          image_crochet={global.image_crochet}
          image_knitting={global.image_knitting}
        />
      )}
    </div>
  );
}

const query = async (): Promise<QueryProps> => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res = await supabase
    .from('profiles')
    .select('id, orders ( products, id, amount, payment_method, created_at, status, orders_statuses( * ) )')
    .eq('id', user!.id)
    .returns<{ id: string; orders: Order[] }[]>()
    .single();

  const allUniqueProductsId = res
    .data!.orders.reduce((acc: string[], order: QueryProps['orders'][0]) => {
      const products = order.products.array;
      const uniqueProductsId = products.map((product) => product.id);
      return [...acc, ...uniqueProductsId];
    }, [])
    .filter((value, index, self) => self.indexOf(value) === index);

  const data = await sanityFetch<QueryProps>({
    query: /* groq */ ` {
      "global":  *[_id == 'global'][0] {
        image_crochet {
          asset -> {
            url,
            altText,
            metadata {
              lqip,
              dimensions {
                width,
                height,
              },
            },
          },
        },
        image_knitting {
          ${Img_Query}
        },
      },
      "products": *[_type == 'product' && _id in $products] {
        ${PRODUCT}
      },
    }`,
    params: {
      products: allUniqueProductsId,
    },
  });

  return { ...data, orders: res.data!.orders };
};
