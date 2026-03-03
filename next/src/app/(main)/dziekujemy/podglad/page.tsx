/**
 * DEV PREVIEW — visual test for PostPurchaseHero.
 * No auth, no Supabase, no Sanity. Delete after visual approval.
 * URL: http://localhost:3000/dziekujemy/podglad
 */
import PostPurchaseHero from '@/components/_postPurchase/PostPurchaseHero';

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

const previewImage = {
  asset: {
    url: 'https://cdn.sanity.io/images/5q82mab3/production/14065c31bb056ce66dd0acf89528f916fb6682ce-2056x2056.jpg',
    altText: 'Podgląd kursu',
    metadata: {
      dimensions: { width: 2056, height: 2056 },
      lqip: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP89eVDPQAJLQNfkP/zaAAAAABJRU5ErkJggg==',
    },
  },
};

const mockOffer = {
  heading: '**Specjalna oferta tylko dla Ciebie!** 🎉',
  paragraph:
    'Dziękujemy za zakup Programu! Z tej okazji przygotowaliśmy dla Ciebie wyjątkową zniżkę na kolejny kurs. Oferta jest dostępna **przez ograniczony czas** — nie daj jej przepaść!',
  discountAmount: 5000,
  expirationDate: new Date(Date.now() + THIRTY_MINUTES_MS).toISOString(),
  couponCode: 'WITA3WDVioTQ',
  offeredItems: [

    {
      _id: 'mock-course-2',
      _type: 'course' as const,
      name: 'Kurs Dziergania na Drutach — Podstawy',
      price: 24900,
      discount: undefined,
      slug: 'kurs-dziergania-na-drutach-podstawy',
      basis: 'knitting',
      image: previewImage,
    },
  ],
};

export default function PostPurchasePreviewPage() {
  return (
    <PostPurchaseHero
      orderId='preview-order-id'
      offer={mockOffer}
    />
  );
}
