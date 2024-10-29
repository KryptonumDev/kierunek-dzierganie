import { Course, CoursesProgress } from '@/global/types';

export type RelatedFilesTypes = {
  course: Course;
  courses_progress: CoursesProgress;
  left_handed: boolean;
  notes: {
    chapterName: string;
    lessons: {
      name: string;
      notes: string;
    }[];
  }[];
  full_name: string;
  authorName: string;
};
