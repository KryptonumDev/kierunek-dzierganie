import type { CoursesProgress, File } from '@/global/types';

export type ListingFilesTypes = {
  courses: {
    _id: string;
    name: string;
    slug: string;
    type: 'course' | 'program';
    generateCertificate: boolean;
    files: File[] | null;
    files_alter: File[] | null;
    chapters: {
      _id: string;
      dateOfUnlock?: string | null;
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
