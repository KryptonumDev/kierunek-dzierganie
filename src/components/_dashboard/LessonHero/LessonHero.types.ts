import type { ImgType } from '@/global/types';

export type Props = {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: {
      _id: string;
      chapterDescription: string;
      chapterName: string;
      chapterImage: ImgType;
      lessons: {
        _id: string;
        name: string;
        video: string;
        lengthInMinutes: number;
        slug: string;
      }[];
    }[];
  };
  lesson: {
    _id: string;
    name: string;
    slug: string;
    video: string;
    lengthInMinutes: number;
  };
  progress: {
    id: number;
    course_id: string;
    owner_id: string;
    progress: {
      [key: string]: {
        [key: string]: {
          ended: boolean;
          notes: string;
        };
      };
    };
  };
};
