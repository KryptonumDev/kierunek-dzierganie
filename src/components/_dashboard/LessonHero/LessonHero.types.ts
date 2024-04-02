import type { CoursesProgress, Chapter, File } from '@/global/types';

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
    files: File[];
  };
  progress: CoursesProgress;
  currentChapterIndex: number;
  currentLessonIndex: number;
  currentChapter: Chapter;
};
