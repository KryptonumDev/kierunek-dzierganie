import { type CtaType, type ImgType } from '@/global/types';

export type CompaniesShowcaseTypes = {
  heading: string;
  paragraph: string;
  list: {
    title: string;
    description: string;
    img: ImgType;
    href: string;
  }[];
  cta: CtaType;
};
