import type { CoursesProgress, ImgType } from '@/global/types';

export type Props = {
  name: string;
  image: ImgType;
  description: string;
  courseSlug: string;
  number: number;
  lessons: {
    _id: string;
    name: string;
    video: string;
    lengthInMinutes: number;
    slug: string;
  }[];
  progress: CoursesProgress['progress']['string'];
};
