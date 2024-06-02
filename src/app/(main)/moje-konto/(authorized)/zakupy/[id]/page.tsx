import OrderData from '@/components/_dashboard/OrderData';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Seo from '@/global/Seo';
import type { Order } from '@/global/types';
import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';

export default async function Order({ params: { id } }: { params: { id: string } }) {
  const data: Order = await query(id);

  const currentUrl = `/moje-konto/zakupy/${id}`;
  const page = [
    { name: 'Historia zakupów', path: '/moje-konto/zakupy' },
    { name: 'Zamówienie', path: currentUrl },
  ];

  return (
    <>
      <Breadcrumbs
        visible={false}
        data={page}
      />
      <OrderData order={data} />
    </>
  );
}

export async function generateMetadata({ params: { id } }: { params: { id: string } }) {
  return Seo({
    title: 'Historia zakupów | Kierunek dzierganie',
    path: `/moje-konto/zakupy/${id}`,
  });
}

const query = async (id: string): Promise<Order & { refundAmount?: number; statement?: string }> => {
  const supabase = createClient();

  const res = await supabase
    .from('orders')
    .select(
      `
        products, 
        id, 
        amount, 
        payment_method, 
        payment_data->statement,
        refundAmount:refund->amount,
        created_at, 
        billing, 
        shipping, 
        discount:used_discount, 
        shippingMethod:shipping_method, 
        virtualMoney:used_virtual_money, 
        orders_statuses( * ),
        profiles( billing_data->firstName )
      `
    )
    .eq('id', id)
    .returns<Order[]>()
    .single();

  if (!res.data) notFound();

  return res.data;
};
