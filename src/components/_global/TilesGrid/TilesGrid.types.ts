import { CtaType, ImgType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph: string;
  list: {
    badge: ImgType;
    img: ImgType;
    cta: CtaType;
  }[];
};