import type { Chapter, CoursesProgress } from '@/global/types';

export type LessonNotesTypes = {
  progress: CoursesProgress;
  currentChapter: Chapter;
  currentLessonIndex: number;
};

export type FormTypes = {
  notes: string;
}
