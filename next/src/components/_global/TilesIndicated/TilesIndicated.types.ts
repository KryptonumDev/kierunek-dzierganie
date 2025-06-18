import { ImgType } from '@/global/types';

export type Props = {
  heading: string;
  list: {
    image?: ImgType;
    title: string;
    paragraph: string;
    cta: {
      text: string;
      href: string;
    };
  }[];
};
