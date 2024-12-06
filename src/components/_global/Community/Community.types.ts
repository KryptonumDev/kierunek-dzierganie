import { CtaType, ImgType } from '@/global/types';

export type Props = {
  backgroundImage?: ImgType;
  heading: string;
  paragraph: string;
  cta?: CtaType;
};

export type QueryProps = {
  facebook: string;
  instagram: string;
  youtube: string;
};
