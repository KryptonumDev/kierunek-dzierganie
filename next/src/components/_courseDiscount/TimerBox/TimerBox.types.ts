import { DiscountCourseType } from '@/global/types';

export type TimerBoxTypes = {
  _type: 'timerBox';
  heading: string;
  paragraph: string;
  discountCourse: DiscountCourseType;
  index: number;
  discountCode?: string;
  expirationDate?: string;
};

export type TimerProps = {
  expirationDate?: string;
};
