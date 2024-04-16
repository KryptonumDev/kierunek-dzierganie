import type { Complexity, ImgType } from '@/global/types';

export type Props = {
  courses: {
    _id: string;
    name: string;
    slug: string;
    image: ImgType;
    complexity:  Complexity;
    courseLength: string;
    progressPercentage: number;
  }[];
};
