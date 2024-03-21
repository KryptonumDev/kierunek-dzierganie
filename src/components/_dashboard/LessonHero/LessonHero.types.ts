import type { CoursesProgress, Chapter } from '@/global/types';

export type Props = {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: Chapter[];
  };
  lesson: {
    _id: string;
    name: string;
    slug: string;
    video: string;
    lengthInMinutes: number;
    files: {
      asset: {
        url: string;
        size: number;
        originalFilename: string;
        _id: string;
      };
    }[];
  };
  progress: CoursesProgress;
  currentChapterIndex: number;
  currentLessonIndex: number;
  currentChapter: Chapter;
};
