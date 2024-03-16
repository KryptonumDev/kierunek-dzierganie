import type { ImgType } from '@/global/types';

export type Props = {
  name: string;
  slug: string;
  image: ImgType;
  courseLength: string;
  complexity: 1 | 2 | 3;
};
