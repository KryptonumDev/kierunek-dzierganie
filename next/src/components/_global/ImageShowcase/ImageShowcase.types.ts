import type { CtaType, ImgType } from '@/global/types';

export type Props = {
  isGrid?: boolean;
  heading: string;
  paragraph: string;
  cta: CtaType;
  cta_Annotation?: string;
  images: ImgType[];
};

export type GridImageShowcaseProps = {
  heading: React.ReactNode,
  paragraph: React.ReactNode,
  cta: React.ReactNode,
  cta_Annotation?: React.ReactNode,
  images: React.ReactNode[]
};

export type ParallaxImageShowcaseProps = {
  heading: React.ReactNode,
  paragraph: React.ReactNode,
  cta: React.ReactNode,
  cta_Annotation?: React.ReactNode,
  images: React.ReactNode[]
};