import type { ImgType } from '@/global/types';

export type Props = {
  courses: {
    _id: string;
    name: string;
    slug: string;
    image: ImgType;
    complexity:  1 | 2 | 3;
    courseLength: string;
  }[];
};
