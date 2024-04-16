import { type ImgType } from '@/global/types';

export type LatestBlogEntriesTypes = {
  heading: string;
  paragraph: string;
  entries: {
    hero: {
      heading: string;
      paragraph: string;
      img: ImgType;
    };
    slug: string;
    portableText: [];
  }[];
};
