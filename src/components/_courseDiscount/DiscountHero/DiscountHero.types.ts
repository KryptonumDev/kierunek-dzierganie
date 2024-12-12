import { ImgType } from '@/global/types';

export type DiscountHeroTypes = {
  _type: 'discountHero';
  image: ImgType;
  heading: string;
  paragraph: string;
  index: number;
  ctaText: string;
  additionalText?: string;
};
