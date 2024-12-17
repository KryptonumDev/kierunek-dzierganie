import { DiscountCourseType, ImgType } from '@/global/types';

export type Props = {
  index?: number;
  heading: string;
  img: ImgType;
  groupId?: string;
  dedicatedThankYouPage?: {
    name?: string;
    slug?: string;
    hasDiscount?: boolean;
    discountCourse?: DiscountCourseType;
  };
};

export type StatusProps = {
  sending: boolean;
  success?: boolean;
};
