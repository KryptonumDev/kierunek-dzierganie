import { ImgType } from '@/global/types';

export type DiscountCtaTypes = {
  image: ImgType;
  heading: string;
  paragraph: string;
  additionalParagraph?: string;
  ctaText: string;
  additionalText?: string;
};
