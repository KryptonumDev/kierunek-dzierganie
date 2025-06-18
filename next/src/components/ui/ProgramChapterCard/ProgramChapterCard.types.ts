import type { CoursesProgress, ImgType } from '@/global/types';

export type Props = {
  circleType: '1' | '2' | '3' | '4' | '5';
  timeLeft: number;
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
