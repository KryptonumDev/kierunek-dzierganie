// import OrderData from '@/components/_dashboard/OrderData';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Seo from '@/global/Seo';
import type { Order } from '@/global/types';
import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';
import CreateOrder from 'src/emails/CreateOrder';

// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_TOKEN);

export default async function Order({ params: { id } }: { params: { id: string } }) {
  const order: Order = await query(id);

  const currentUrl = `/moje-konto/zakupy/${id}`;
  const page = [
    { name: 'Historia zakupów', path: '/moje-konto/zakupy' },
    { name: 'Zamówienie', path: currentUrl },
  ];

  // const { data, error } = await resend.emails.send({
  //   from: 'Acme <onboarding@resend.dev>',
  //   to: ['kierunek.dzierganie@gmail.com'],
  //   subject: 'Nowe zamówienie!',
  //   text: '',
  //   react: CreateOrder({ data: order }),
  // });
  // console.log(data, error);
  return (
    <>
      <Breadcrumbs
        visible={false}
        data={page}
      />
      {/* <OrderData order={order} /> */}
      <CreateOrder data={order} />
    </>
  );
}

export async function generateMetadata({ params: { id } }: { params: { id: string } }) {
  return Seo({
    title: 'Historia zakupów | Kierunek dzierganie',
    path: `/moje-konto/zakupy/${id}`,
  });
}

const query = async (id: string): Promise<Order> => {
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

  return res.data;
};
