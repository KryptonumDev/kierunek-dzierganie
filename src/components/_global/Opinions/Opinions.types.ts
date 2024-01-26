import type { CtaType } from '@/global/types';

export type Props = {
  heading: string;
  list: {
    author: string;
    description: string;
  }[];
  paragraph: string;
  cta: CtaType;
  cta_Annotation: string;
};