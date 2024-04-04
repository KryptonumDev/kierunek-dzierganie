import { type ImgType } from '@/global/types';

export type SuggestedCoursesTypes = {
  heading: string;
  paragraph: string;
  courses: {
    price: number;
    name: string;
    course: {
      _id: string;
      image: ImgType;
      type: string;
      complexity: number;
      slug: string;
    };
  }[];
};
