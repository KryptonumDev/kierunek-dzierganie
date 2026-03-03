import type { PostPurchaseOfferPayload } from '@/utils/resolve-post-purchase-offer';

export type PostPurchaseHeroProps = {
  orderId: string;
  offer: PostPurchaseOfferPayload;
};

export type OfferSectionProps = {
  offer: PostPurchaseOfferPayload;
};
