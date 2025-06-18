import { ImgType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph: string;
  list: {
    name: string;
    slug: string;
    img: ImgType;
    excerpt: string;
  }[];
  index?: number;
};

export type SliderProps = {
  list: {
    name: string;
    img: React.ReactNode;
    excerpt: string;
    cta: React.ReactNode;
  }[];
};