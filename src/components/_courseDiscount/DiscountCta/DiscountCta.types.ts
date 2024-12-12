import { ImgType } from '@/global/types';

export type DiscountCtaTypes = {
  _type: 'discountCta';
  image: ImgType;
  heading: string;
  paragraph: string;
  additionalParagraph?: string;
  ctaText: string;
  additionalText?: string;
  index: number;
};
