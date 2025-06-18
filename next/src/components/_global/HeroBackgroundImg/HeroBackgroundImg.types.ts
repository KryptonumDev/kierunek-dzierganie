import type { CtaType, ImgType } from '@/global/types';

export type Props = {
  isReversed?: boolean;
  heading: string;
  paragraph: string;
  cta: CtaType;
  cta_Annotation: string;
  img: ImgType;
  aboveTheFold: boolean;
};