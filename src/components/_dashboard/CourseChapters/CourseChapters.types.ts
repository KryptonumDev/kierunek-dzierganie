import type { CoursesProgress, ImgType } from '@/global/types';

export type Props = {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: {
      _id: string;
      chapterDescription: string;
      chapterName: string;
      chapterImage: ImgType;
      lessons: {
        _id: string;
        name: string;
        video: string;
        lengthInMinutes: number;
        slug: string;
      }[];
    }[];
  };
  courses_progress: CoursesProgress;
};
