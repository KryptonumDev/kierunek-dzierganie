import { CtaType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph: string;
  cta?: CtaType;
  list: {
    heading: string;
    paragraph: string;
  }[];
};