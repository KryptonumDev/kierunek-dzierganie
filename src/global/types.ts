import type { ComponentProps } from '@/components/Components';

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

export type BlogPageQueryProps = {
  hero_Heading: string;
  hero_Paragraph: string;
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
