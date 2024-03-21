import type { ImgType } from '@/global/types';

export type Props = {
  name: string;
  image: ImgType;
  description: string;
  courseSlug: string;
  number: number;
  lessons: {
    name: string;
    video: string;
    lengthInMinutes: number;
    slug: string;
  }[];
};
