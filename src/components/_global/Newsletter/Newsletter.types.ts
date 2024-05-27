import { ImgType } from '@/global/types';

export type Props = {
  index?: number;
  heading: string;
  img: ImgType;
  groupId?: string;
};

export type StatusProps = {
  sending: boolean;
  success?: boolean;
};
