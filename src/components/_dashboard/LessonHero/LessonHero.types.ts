import type { CoursesProgress, Chapter, File } from '@/global/types';

export type Props = {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: Chapter[];
  };
  lesson: {
    title: string;
    _id: string;
    slug: string;
    video: string;
    lengthInMinutes: number;
    files: File[];
  };
  left_handed: boolean;
  progress: CoursesProgress;
  currentChapterIndex: number;
  currentLessonIndex: number;
  currentChapter: Chapter;
  id: string;
};
