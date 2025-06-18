import { Course } from '@/global/types';

export type RelatedFilesTypes = {
  course: Course;
  left_handed: boolean;
  notes: {
    chapterName: string;
    lessons: {
      name: string;
      notes: string;
    }[];
  }[];
};
