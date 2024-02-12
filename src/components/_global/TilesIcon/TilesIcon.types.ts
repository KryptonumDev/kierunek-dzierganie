import { ImgType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph: string;
  list: {
    icon: ImgType;
    title: string;
    description: string;
  }[];
};
