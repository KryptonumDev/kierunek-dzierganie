import { CtaType } from '@/global/types';

export type Props = {
  isHighlighted: boolean;
  heading: string;
  paragraph: string;
  cta?: CtaType;
};

export type QueryProps = {
  facebook: string;
  instagram: string;
  youtube: string;
};