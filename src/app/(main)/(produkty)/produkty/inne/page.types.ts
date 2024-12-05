import type { HeroSimpleTypes } from '@/components/_global/HeroSimple';
import type { LatestBlogEntriesTypes } from '@/components/_global/LatestBlogEntries';
import type { ProductCard } from '@/global/types';
import type { LogoSectionTypes } from '@/components/_global/LogoSection';

export type OtherProductsPage_QueryTypes = {
  page: {
    HeroSimple: HeroSimpleTypes;
    LatestBlogEntries: LatestBlogEntriesTypes;
    listing_title: string;
    listing_text: string;
    listing_HighlightedCourse: ProductCard;
    listing_HighlightedCourse_Badge: string;
    LogoSection: LogoSectionTypes;
  };
  productsTotalCount: number;
  products: ProductCard[];
};
