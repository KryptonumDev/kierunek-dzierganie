export type CtaType = {
  theme: 'primary' | 'secondary';
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