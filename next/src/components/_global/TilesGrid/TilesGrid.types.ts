import { CtaType, ImgType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph: string;
  list: {
    img: ImgType;
    cta: CtaType;
  }[];
};