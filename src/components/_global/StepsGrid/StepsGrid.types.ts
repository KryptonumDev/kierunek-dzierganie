import type { ImgType } from '@/global/types';

export type StepsGridTypes = {
  heading: string;
  paragraph: string;
  list: {
    img: ImgType;
    heading: string;
    paragraph: string;
  }[];
};
