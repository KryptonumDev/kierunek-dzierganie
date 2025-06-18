import { CtaType, ImgType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph: string;
  cta: CtaType;
  list: {
    img: ImgType;
    heading: string;
    paragraph: string;
  }[];
};
