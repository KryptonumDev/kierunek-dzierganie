import type { File, ImgType } from '@/global/types';

export type LessonDescriptionTypes = {
  lesson: {
    description: string;
    flex: {
      title: string;
      description: string;
      img: ImgType;
    }[];
    files_alter: File[];
  };
};
