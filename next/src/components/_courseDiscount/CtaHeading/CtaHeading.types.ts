import { DiscountCourseRefType } from '@/global/types';

export type CtaHeadingTypes = {
  _type: 'ctaHeading';
  heading: string;
  paragraph: string;
  ctaText?: string;
  additionalText?: string;
  index: number;
  course: DiscountCourseRefType;
};
