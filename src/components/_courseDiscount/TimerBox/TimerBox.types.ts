import { DiscountCourseType } from '@/global/types';

export type TimerBoxTypes = {
  _type: 'timerBox';
  heading: string;
  paragraph: string;
  discountCourse: DiscountCourseType;
  index: number;
};

export type TimerProps = {
  initialMinutes: number;
};
