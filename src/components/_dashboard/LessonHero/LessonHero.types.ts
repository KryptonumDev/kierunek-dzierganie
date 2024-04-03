import type { CoursesProgress, Chapter, File, Course } from '@/global/types';

export type Props = {
  course: Course;
  lesson: {
    title: string;
    _id: string;
    slug: string;
    video: string;
    video_alter: string;
    lengthInMinutes: number;
    files: File[];
    files_alter: File[];
  };
  left_handed: boolean;
  progress: CoursesProgress;
  currentChapterIndex: number;
  currentLessonIndex: number;
  currentChapter: Chapter;
  id: string;
};
