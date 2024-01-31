import type { ComponentProps } from '@/components/_global/Components';


export type CtaType = {
  href: string;
  text: string | React.ReactNode;
};

export type ImgType = {
  asset: {
    url: string,
    altText: string,
    metadata: {
      dimensions: {
        width: number,
        height: number,
      },
      lqip: string,
    },
  },
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

export type generateStaticParamsProps = {
  slug: string;
}