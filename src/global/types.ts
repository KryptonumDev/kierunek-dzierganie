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
  name: string;
  slug?: string;
  content: ComponentProps[];
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
