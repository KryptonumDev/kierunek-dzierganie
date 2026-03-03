import PostPurchaseHero from '@/components/_postPurchase/PostPurchaseHero';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Seo from '@/global/Seo';
import { resolvePostPurchaseOffer } from '@/utils/resolve-post-purchase-offer';
import { createClient } from '@/utils/supabase-server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function PostPurchaseThankYouPage({ params: { orderId } }: { params: { orderId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/moje-konto');
  }

  const result = await resolvePostPurchaseOffer(orderId, user.id);

  // Forbidden or not found — send to account root to avoid leaking order existence
  if (result.type === 'forbidden' || result.type === 'not-found') {
    redirect('/moje-konto');
  }

  // No offer configured — fall back to the standard order detail page
  if (result.type === 'no-offer') {
    redirect(`/moje-konto/zakupy/${orderId}`);
  }

  const page = [{ name: 'Potwierdzenie zamówienia', path: `/dziekujemy/${orderId}` }];

  return (
    <>
      <Breadcrumbs
        data={page}
        visible={false}
      />
      <PostPurchaseHero
        orderId={orderId}
        offer={result.offer}
      />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return Seo({
    title: 'Dziękujemy za zakup | Kierunek Dzierganie',
    path: '/dziekujemy',
    visible: false,
  });
}
