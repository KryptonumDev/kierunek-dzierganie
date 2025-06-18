import type { Complexity, ImgType } from '@/global/types';

export type Props = {
  totalCourses: number;
  lastWatchedCourse: string;
  lastWatchedList: string[];
  courses: {
    _id: string;
    name: string;
    slug: string;
    image: ImgType;
    complexity: Complexity;
    courseLength: string;
    progressPercentage: number;
    excerpt: string;
    progressId: string;
  }[];
  categories: {
    name: string;
    slug: string;
    _id: string;
  }[];
  authors: {
    name: string;
    slug: string;
    _id: string;
  }[];
  sort: string | null;
};

export type FiltersTypes = {
  categories: {
    name: string;
    slug: string;
    _id: string;
  }[];
  authors?: {
    name: string;
    slug: string;
    _id: string;
  }[];
  sort: string | null;
};
