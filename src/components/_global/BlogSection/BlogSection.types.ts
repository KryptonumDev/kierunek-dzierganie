import { type ImgType } from '@/global/types';

export type BlogSectionTypes = {
  data: {
    blog_Heading: string;
    blog_Paragraph: string;
    blog_HighlightedPost: {
      hero_Heading: string;
      hero_Paragraph: string;
      hero_Author: {
        slug: string;
        heading: string;
        paragraph: string;
        img: ImgType;
      };
    };
  };
};
