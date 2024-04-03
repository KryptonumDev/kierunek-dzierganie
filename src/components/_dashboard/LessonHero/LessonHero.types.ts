import type { CoursesProgress, Chapter, File, Course } from '@/global/types';

export type Props = {
  course: Course;
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
