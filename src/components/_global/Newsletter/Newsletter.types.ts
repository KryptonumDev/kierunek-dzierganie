import { ImgType } from '@/global/types';

export type Props = {
  heading: string;
  img: ImgType;
  index?: number;
};

export type StatusProps = {
  sending: boolean;
  success?: boolean;
};
