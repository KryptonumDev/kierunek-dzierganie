import { CtaType, type ImgType } from '@/global/types';

export type TeamShowcaseTypes = {
  heading: string;
  paragraph: string;
  list: {
    title: string;
    description: string;
    isLeftSide: boolean;
    img: ImgType;
  }[];
  cta: CtaType;
};
