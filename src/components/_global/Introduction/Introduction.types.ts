import { CtaType, ImgType } from '@/global/types';

export type Props = {
  isReversed: boolean;
  heading: string;
  paragraph: string;
  cta?: CtaType;
  img: ImgType;
};