import type { ComponentProps } from '@/components/Components';
import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';
import type { DescriptionTypes } from '@/components/_product/Description/Description';

export type CtaType = {
  href: string;
  text: string | React.ReactNode;
};

export type ImgType = {
  asset: {
    url: string;
    altText: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
      lqip: string;
    };
  };
};

export type ProductCard = {
  _id: string;
  basis: 'crocheting' | 'knitting';
  slug: string;
  name: string;
  price?: number;
  discount?: number;
  countInStock?: number;
  featuredVideo?: string;
  gallery?: ImgType;
  course?: {
    complexity: 1 | 2 | 3;
  };
  variants: Array<{
    name: string;
    price: number;
    discount: number;
    countInStock: number;
    featuredVideo: string;
    gallery: ImgType;
  }>;
};

export type Product = {
  _id: string;
  price: number;
  discount: number;
  name: string;
  quantity: number;
  type: 'physical' | 'variable' | 'digital' | 'bundle';
  slug: {
    current: string;
  };
  course?: {
    complexity: 1 | 2 | 3;
  };
  variants: Array<{
    _key: number;
    name: string;
    price: number;
    discount: number;
    gallery: Array<ImgType>;
  }>;
  gallery: ImgType;
};

export type ProductVariant = {
  name: string;
  price: number;
  discount: number;
  countInStock: number;
  attributes?: Array<{
    type: string;
    name: string;
    value: string;
  }>;
  featuredVideo: string;
  gallery: Array<ImgType>;
};

export type ProductPhysical = {
  name: string;
  price?: number;
  discount?: number;
  countInStock?: number;
  featuredVideo?: string;
  gallery?: Array<ImgType>;
};

export type generateMetadataProps = {
  slug?: string;
  seo: {
    title: string;
    description: string;
  };
};

export type PageQueryProps = {
  name?: string;
  slug?: string;
  content: ComponentProps[];
} & generateMetadataProps;

export type BlogPageQueryProps = {
  HeroSimple: HeroSimpleTypes;
  categories_Heading: string;
  categories_Paragraph: string;
  blogPosts: {
    categories: {
      name: string;
      slug: string;
    }[];
  }[];
  blog_Heading: string;
  blog_Paragraph: string;
  blog_HighlightedPost: {
    hero: {
      heading: string;
      img: ImgType;
      paragraph: string;
    };
    author: {
      heading: string;
      paragraph: string;
      img: ImgType;
    };
  };
};

export type BlogPostQueryProps = {
  hero: {
    img: ImgType;
    heading: string;
    paragraph: string;
  };
  content: [];
  author: {
    img: ImgType;
    heading: string;
    paragraph: string;
  };
  date: string;
};

export type BlogCategoryPageQueryProps = {
  name: string;
  filteredBlogPosts: {
    categories: {
      name: string;
      slug: string;
    }[];
  }[];
} & BlogPageQueryProps;

export type Node = {
  children?: Node[];
  style?: string;
  text?: string;
  subheadings?: Node[];
  slug?: string;
  _type?: string;
  marks?: string;
  icon?: ImgType;
};

export type ProductPageQueryProps = {
  name: string;
  slug: string;
  _id: string;
  type: string;
  variants: Array<ProductVariant>;
  gallery?: Array<ImgType>;
  featuredVideo?: string;
  price?: number;
  discount?: number;
  countInStock?: number;
  parameters: Array<{
    name: string;
    value: string;
  }>;
  description: DescriptionTypes[];
} & generateMetadataProps;

export type generateStaticParamsProps = {
  slug: string;
};

export type generateBlogCategoryPageStaticParamsProps = {
  slug: string;
  number: string;
};

export type BlogsCategoryStaticParamsType = {
  categories: {
    name: string;
    slug: string;
  }[];
};

export type generateBlogPaginationStaticParamsProps = {
  number: string;
};

export type CoursesProgress = {
  id: number;
  course_id: string;
  owner_id: string;
  progress: {
    [key: string]: {
      [key: string]: {
        ended: boolean;
        notes: string;
      };
    };
  };
};

export type generateStaticParamsBlogPagination = {
  number: string;
}[];

export type Chapter = {
  _id: string;
  chapterDescription: string;
  chapterName: string;
  chapterImage: ImgType;
  lessons: {
    _id: string;
    name: string;
    video: string;
    lengthInMinutes: number;
    slug: string;
  }[];
};
