import { CtaType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph?: string;
  list: {
    title: string;
    description: string;
  }[];
  cta?: CtaType;
};
