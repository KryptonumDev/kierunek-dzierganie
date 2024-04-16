import type { CoursesProgress, File } from '@/global/types';

export type ListingFilesTypes = {
  courses: {
    _id: string;
    name: string;
    slug: string;
    chapters: {
      _id: string;
      lessons: {
        _id: string;
        files: File[] | null;
        files_alter: File[] | null;
      }[];
    }[];
  }[];
  left_handed: boolean;
  progress: CoursesProgress[];
};
