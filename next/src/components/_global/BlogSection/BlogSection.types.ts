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
};

export type HighlightedPostType = {
  portableText: [];
  slug?: string;
  hero: {
    img: ImgType;
    heading: string;
    paragraph: string;
  };
  href?: string;
  author: {
    heading: string;
    paragraph: string;
    img: ImgType;
  };
};

export type BlogPostsType = {
  portableText: [];
  hero: {
    img: ImgType;
    heading: string;
    paragraph: string;
  };
  slug: string;
  number: number;
};
