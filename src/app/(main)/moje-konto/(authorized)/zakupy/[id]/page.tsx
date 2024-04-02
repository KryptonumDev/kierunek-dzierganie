import OrderData from '@/components/_dashboard/OrderData';
import type { Order, Product } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { PRODUCT } from 'src/queries/PRODUCT';

type QueryProps = {
  products: Product[];
  order: Order;
};

export default async function Order({ params: { id } }: { params: { id: string } }) {
  const { order, products }: QueryProps = await query(id);

  return (
    <OrderData
      order={order}
      products={products}
    />
  );
}

const query = async (id: string): Promise<QueryProps> => {
  const supabase = createServerActionClient({ cookies });

  const res = await supabase
    .from('orders')
    .select('products, id, amount, payment_method, created_at, billing, shipping, orders_statuses( * )')
    .eq('id', id)
    .returns<Order[]>()
    .single();

  if (!res.data) notFound();

  const productIds = res.data!.products.array.map((product) => product.id);

  const data = await sanityFetch<QueryProps>({
    query: /* groq */ ` {
      "products": *[_type == 'product' && _id in $products] {
        ${PRODUCT}
      },
    }`,
    params: {
      products: productIds,
    },
  });

  return { ...data, order: res.data };
};
