import { type ImgType } from '@/global/types';

export type ProcessShowcaseTypes = {
  list: {
    heading: string;
    process: {
      paragraph: string;
      img: ImgType;
    }[];
  }[];
};
