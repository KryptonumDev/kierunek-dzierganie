import { CtaType } from '@/global/types';
import type { MotionValue } from 'framer-motion';

export type Props = {
  heading: string;
  list: string[];
  cta?: CtaType;
  index?: number;
};

export type ListProps = {
  list: Props['list'];
};
export type ListItemProps = {
  marginLeft: string;
  y: number;
  scrollYProgress: MotionValue<number>;
  children: React.ReactNode;
};
