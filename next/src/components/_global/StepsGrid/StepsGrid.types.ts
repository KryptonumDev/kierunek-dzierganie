import type { ImgType } from '@/global/types';

export type StepsGridTypes = {
  heading: string;
  paragraph: string;
  list: {
    relatedCourse: {
      slug: string;
      basis: string;
    };
    img: ImgType;
    heading: string;
    paragraph: string;
  }[];
};
