import OrderData from '@/components/_dashboard/OrderData';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Seo from '@/global/Seo';
import type { Order, ProductCard } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';
import { PRODUCT_CARD_QUERY } from 'src/global/constants';

type QueryProps = {
  products: ProductCard[];
  order: Order;
};

export default async function Order({ params: { id } }: { params: { id: string } }) {
  const { order, products }: QueryProps = await query(id);

  const currentUrl = `/moje-konto/zakupy/${id}`;
  const page = [
    { name: 'Historia zakupów', path: '/moje-konto/zakupy' },
    { name: 'Zamówienie', path: currentUrl },
  ];

  return (
    // TODO: remove products prop?
    <>
      <Breadcrumbs
        visible={false}
        data={page}
      />
      <OrderData
        order={order}
        products={products}
      />
    </>
  );
}

export async function generateMetadata({ params: { id } }: { params: { id: string } }) {
  return Seo({
    title: 'Historia zakupów | Kierunek dzierganie',
    path: `/moje-konto/zakupy/${id}`,
  });
}

const query = async (id: string): Promise<QueryProps> => {
  const supabase = createClient();

  const res = await supabase
    .from('orders')
    .select(
      `
        products, 
        id, 
        amount, 
        payment_method, 
        created_at, 
        billing, 
        shipping, 
        discount:used_discount, 
        shippingMethod:shipping_method, 
        virtualMoney:used_virtual_money, 
        orders_statuses( * )
      `
    )
    .eq('id', id)
    .returns<Order[]>()
    .single();

  if (!res.data) notFound();

  const productIds = res.data!.products.array.map((product) => product.id);

  const data = await sanityFetch<QueryProps>({
    query: /* groq */ ` {
      "products": *[_type == 'product' && _id in $products] {
        ${PRODUCT_CARD_QUERY}
      },
    }`,
    params: {
      products: productIds,
    },
  });

  return { ...data, order: res.data };
};
