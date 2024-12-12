import { ImgType } from '@/global/types';

export type ImageHeadingTypes = {
  _type: 'imageHeading';
  image: ImgType;
  heading: string;
  paragraph: string;
  index: number;
};

export type TimerTypes = {
  initialMinutes: number;
};
