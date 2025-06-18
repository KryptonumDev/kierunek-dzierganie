import { ImgType } from '@/global/types';

export type Props = {
  image?: ImgType;
  heading: string;
  paragraph: string;
  list: {
    title: string;
    description: string;
  }[];
};
