import type { CtaType } from '@/global/types';

export type HeroSimpleTypes = {
  isHighlighted: boolean;
  heading: string;
  paragraph?: string;
  cta?: CtaType;
};
