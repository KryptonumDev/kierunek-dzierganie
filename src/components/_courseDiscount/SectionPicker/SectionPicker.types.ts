import { discountComponentsType, DiscountCourseType } from '@/global/types';

export type SectionPickerTypes = {
  data: discountComponentsType;
  discountCourse: DiscountCourseType;
  discountCode?: string;
  expirationDate?: string;
};
