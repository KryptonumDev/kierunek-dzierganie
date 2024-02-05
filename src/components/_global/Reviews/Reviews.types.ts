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
  LeftIcon: React.ReactNode;
  RightIcon: React.ReactNode;
  QuoteIcon: React.ReactNode;
  RatingIcon: React.ReactNode;
};