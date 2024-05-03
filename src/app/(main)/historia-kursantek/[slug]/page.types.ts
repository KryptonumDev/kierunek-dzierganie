import type { ImageShowcaseProps } from '@/components/_global/ImageShowcase';
import type { IntroductionProps } from '@/components/_global/Introduction';

export type StudentPageQueryTypes = {
  name: string;
  userId?: string;
  content: {
    Introduction: IntroductionProps;
    ImageShowcase?: ImageShowcaseProps;
  }
};

export type StudentPageTypes = {
  params: {
    slug: string
  }
};