import type { CtaType, DiscountCourseType, ImgType } from '@/global/types';

export type ProductOptionsSectionCardItem = {
  _key?: string;
  _type: 'ProductOptionsSection_Item';
  img: ImgType;
  heading: string;
  paragraph: string;
  cta: CtaType;
};

export type ProductOptionsSectionNewsletterItem = {
  _key?: string;
  _type: 'ProductOptionsSection_NewsletterItem';
  img: ImgType;
  heading: string;
  paragraph?: string;
  groupId?: string;
  buttonLabel?: string;
  dedicatedThankYouPage?: {
    name?: string;
    slug?: string;
    hasDiscount?: boolean;
    discountCourse?: DiscountCourseType;
  };
};

export type ProductOptionsSectionItem =
  | ProductOptionsSectionCardItem
  | ProductOptionsSectionNewsletterItem;

export type Props = {
  heading: string;
  paragraph?: string;
  list: ProductOptionsSectionItem[];
};
