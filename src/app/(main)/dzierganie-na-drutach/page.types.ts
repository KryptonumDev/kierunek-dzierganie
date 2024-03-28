import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';
import type { StepsGridTypes } from '@/components/_global/StepsGrid';
import type { LatestBlogEntriesTypes } from '@/components/_global/LatestBlogEntries';
import type { ProductCard } from '@/global/types';

export type KnittingPage_QueryTypes = {
  page: {
    HeroSimple: HeroSimpleTypes;
    StepsGrid: StepsGridTypes;
    LatestBlogEntries: LatestBlogEntriesTypes;
  };
  products: ProductCard[];
};
