import { type ImgType } from '@/global/types';

export type BlogSectionTypes = {
  data: {
    blog_Heading: string;
    blog_Paragraph: string;
    blog_HighlightedPost: HighlightedPostType;
    slug?: string;
  };
};

export type HighlightedPostType = {
  hero_Heading: string;
  hero_Img: ImgType;
  hero_Paragraph: string;
  hero_Author: {
    heading: string;
    paragraph: string;
    img: ImgType;
  };
};

export type BlogPostsType = {
  hero_Img: ImgType;
  hero_Heading: string;
  hero_Paragraph: string;
  slug: string;
};
