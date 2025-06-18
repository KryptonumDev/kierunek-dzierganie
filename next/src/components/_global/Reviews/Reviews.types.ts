import { ImgType } from '@/global/types';

export type Props = {
  heading: string;
  list: {
    rating: number;
    name: string;
    review: string;
    images: ImgType[];
  }[];
};

export type SliderProps = {
  list: {
    rating: number;
    name: string;
    review: string;
    images: React.ReactNode[];
  }[];
};

export type CardProps = {
  rating: number;
  name: string;
  review: string;
  images?: React.ReactNode[];
};
