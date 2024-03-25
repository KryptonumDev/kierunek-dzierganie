import type { ImgType } from '@/global/types';

export type LessonDescriptionTypes = {
  lesson: {
    description: string;
    flex: {
      title: string;
      description: string;
      img: ImgType;
    }[];
    files_alter: {
      asset: {
        url: string;
        size: number;
        originalFilename: string;
        _id: string;
      };
    }[];
  };
};
