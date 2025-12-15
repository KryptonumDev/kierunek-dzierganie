import EmptyOrders from '@/components/_dashboard/EmptyOrders';
import ListingOrders from '@/components/_dashboard/ListingOrders';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { Img_Query } from '@/components/ui/image';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { ImgType, Order, ProductCard } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';
import { PRODUCT_CARD_QUERY } from 'src/global/constants';

const currentUrl = '/moje-konto/zakupy';
const page = [{ name: 'Historia zakupów', path: currentUrl }];

type QueryProps = {
  global: {
    image_knitting: ImgType;
    image_crochet: ImgType;
  };
  products: ProductCard[];
  orders: Order[];
};

export default async function Orders() {
  const { orders, global, products }: QueryProps = await query();

  return (
    <div>
      <Breadcrumbs
        visible={false}
        data={page}
      />
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

export async function generateMetadata() {
  return await QueryMetadata('Orders_Page', currentUrl);
}

const query = async (): Promise<QueryProps> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res = await supabase
    .from('profiles')
    .select('id, orders ( products, id, amount, payment_method, created_at, status, orders_statuses( * ) )')
    .eq('id', user!.id)
    .order('id', { referencedTable: 'orders', ascending: false })
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
      "products": *[(_type == 'product' || _type == 'course' || _type == 'bundle' || _type == 'voucher') && _id in $products] {
        ${PRODUCT_CARD_QUERY}
      },
    }`,
    tags: ['global', 'product', 'course', 'bundle'],
    params: {
      products: allUniqueProductsId,
    },
  });

  return { ...data, orders: res.data!.orders };
};
