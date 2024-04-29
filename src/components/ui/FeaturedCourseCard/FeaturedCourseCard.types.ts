import type { Complexity, ImgType } from '@/global/types';

export type Props = {
  name: string;
  slug: string;
  image: ImgType;
  courseLength: string;
  complexity: Complexity;
  progressPercentage: number;
  excerpt?: JSX.Element;
};
