import type { ImgType } from '@/global/types';

export type Props = {
  heading: string;
  list: {
    img: ImgType;
    description: string;
  }[];
};