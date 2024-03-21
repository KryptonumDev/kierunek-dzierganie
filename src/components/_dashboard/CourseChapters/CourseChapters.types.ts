import type { ImgType } from '@/global/types';

export type Props = {
  course: {
    _id: string;
    name: string;
    slug: string;
    chapters: {
      chapterDescription: string;
      chapterName: string;
      chapterImage: ImgType;
      lessons: {
        name: string;
        video: string;
        lengthInMinutes: number;
        slug: string;
      }[];
    }[];
  };
};
