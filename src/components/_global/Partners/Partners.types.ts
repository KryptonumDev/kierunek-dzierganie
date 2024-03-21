import { CtaType, ImgType } from '@/global/types';

export type Props = {
  heading: string;
  paragraph: string;
  cta?: CtaType;
  list: {
    img: ImgType;
    name: string;
    description: string;
  }[];
  index?: number;
};

export type SliderProps = {
  list: {
    img: React.ReactNode;
    name: string;
    description: string;
  }[];
};
