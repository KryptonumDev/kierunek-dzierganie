import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';
import type { StepsGridTypes } from '@/components/_global/StepsGrid';
import type { LatestBlogEntriesTypes } from '@/components/_global/LatestBlogEntries';
import type { ProductCard } from '@/global/types';
import type { LogoSectionTypes } from '@/components/_global/LogoSection';

export type KnittingPage_QueryTypes = {
  page: {
    HeroSimple: HeroSimpleTypes;
    StepsGrid: StepsGridTypes;
    LatestBlogEntries: LatestBlogEntriesTypes;
    listing_title: string;
    listing_text: string;
    listing_HighlightedCourse: ProductCard;
    listing_HighlightedCourse_Badge: string;
    LogoSection: LogoSectionTypes;
  };
  products: ProductCard[];
  productsTotalCount: number;
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

export type CrochetingPage_QueryTypes = {
  page: {
    LogoSection: LogoSectionTypes;
    HeroSimple: HeroSimpleTypes;
    StepsGrid: StepsGridTypes;
    LatestBlogEntries: LatestBlogEntriesTypes;
    listing_title: string;
    listing_text: string;
    listing_HighlightedCourse: ProductCard;
    listing_HighlightedCourse_Badge: string;
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
