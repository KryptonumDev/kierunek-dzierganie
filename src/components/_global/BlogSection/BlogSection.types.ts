import type { ImgType } from '@/global/types';

export type BlogSectionTypes = {
  heading: string;
  paragraph: string;
  highlightedPost: HighlightedPostType;
  blogPosts: {
    categories: {
      name: string;
      slug: string;
    }[];
  }[];
  slug?: string;
  number?: number;
  pathPrefix?: string;
  addPagePrefix?: boolean;
};

export type HighlightedPostType = {
  hero_Heading: string;
  hero_Img: ImgType;
  hero_Paragraph: string;
  href?: string;
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
  number: number;
};
