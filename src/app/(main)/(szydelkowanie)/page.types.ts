import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';
import type { StepsGridTypes } from '@/components/_global/StepsGrid';
import type { LatestBlogEntriesTypes } from '@/components/_global/LatestBlogEntries';
import type { ProductCard } from '@/global/types';

export type CrochetingPage_QueryTypes = {
  page: {
    HeroSimple: HeroSimpleTypes;
    StepsGrid: StepsGridTypes;
    LatestBlogEntries: LatestBlogEntriesTypes;
    listing_title: string;
    listing_text: string;
  };
  productsTotalCount: number;
  products: ProductCard[];
  categories: {
    name: string;
    slug: string;
    _id: string;
  }[];
  authors: {
    name: string;
    slug: string;
    _id: string;
  }[];
};
