import { DiscountCourseType } from '@/global/types';
import { DiscountCourseComponentProps } from './SectionPicker';

export type SectionPickerTypes = {
  data: DiscountCourseComponentProps[];
  discountCourse: DiscountCourseType;
  discountCode?: string;
  expirationDate?: string;
};
