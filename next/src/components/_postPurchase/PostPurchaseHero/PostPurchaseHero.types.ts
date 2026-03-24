import type { PostPurchaseOfferPayload } from '@/utils/resolve-post-purchase-offer';

export type PostPurchaseHeroProps = {
  orderId?: string;
  offer: PostPurchaseOfferPayload;
  previewMode?: boolean;
};

export type OfferSectionProps = {
  offer: PostPurchaseOfferPayload;
};
