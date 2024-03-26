import { type ImgType } from '@/global/types';

export type HeroTypes = {
  paragraph: string;
  img: ImgType;
  heading: string;
  author: {
    heading: string;
    paragraph: string;
    img: ImgType;
  };
  date: string;
};
