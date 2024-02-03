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