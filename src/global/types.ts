import type { ComponentProps } from '@/components/Components';
import { HeroSimpleTypes } from '@/components/_global/HeroSimple';

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
  variants: Array<{
    name: string;
    price: number;
    discount: number;
    countInStock: number;
    featuredVideo: string;
    gallery: ImgType;
  }>;
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

export type StatutePageQueryProps = {
  global: {
    tel: string;
    email: string;
  };
  page: StatutePage;
};

export type PrivacyPolicyPage = {
  header_Heading: string;
  header_Description: string;
  content: {
    title: string;
    description: string;
  }[];
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
    hero_Heading: string;
    hero_Img: ImgType;
    hero_Paragraph: string;
    hero_Author: {
      heading: string;
      paragraph: string;
      img: ImgType;
    };
  };
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

export type StatutePage = {
  header_Heading: string;
  header_Description: string;
  content: {
    title: string;
    description: string;
  }[];
  files: {
    asset: {
      url: string;
      originalFilename: string;
      size: number;
    };
  }[];
} & generateMetadataProps;

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
} & generateMetadataProps;

export type generateStaticParamsProps = {
  slug: string;
};

export type generateBlogCategoryPageStaticParamsProps = {
  slug: string;
  number: string;
};

export type Product = {
  _id: string;
  price: number;
  discount: number;
  name: string;
  quantity: number;
  slug: {
    current: string;
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