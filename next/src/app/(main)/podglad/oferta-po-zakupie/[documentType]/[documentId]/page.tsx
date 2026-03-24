import PostPurchaseHero from '@/components/_postPurchase/PostPurchaseHero';
import Seo from '@/global/Seo';
import { resolvePostPurchaseOfferPreview } from '@/utils/resolve-post-purchase-offer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PreviewPageProps = {
  params: {
    documentType: 'course' | 'bundle';
    documentId: string;
  };
};

export default async function PostPurchaseOfferPreviewPage({
  params: { documentId, documentType },
}: PreviewPageProps) {
  if (documentType !== 'course' && documentType !== 'bundle') {
    notFound();
  }

  const result = await resolvePostPurchaseOfferPreview(documentId, documentType);

  if (result.type === 'not-found') {
    notFound();
  }

  if (result.type === 'no-offer') {
    return (
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem var(--pageMargin)' }}>
        <h1 style={{ marginBottom: '0.75rem' }}>Podgląd oferty po zakupie</h1>
        <p style={{ color: 'var(--primary-600, #7a6560)', lineHeight: 1.7 }}>
          Włącz ofertę po zakupie, wybierz tryb oferty i uzupełnij wymagane pola, aby zobaczyć pełny podgląd.
        </p>
      </section>
    );
  }

  return (
    <PostPurchaseHero
      offer={result.offer}
      previewMode={true}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return Seo({
    title: 'Podgląd oferty po zakupie | Kierunek Dzierganie',
    path: '/podglad/oferta-po-zakupie',
    visible: false,
  });
}
