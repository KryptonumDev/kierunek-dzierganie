import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import type { CrochetingPage_QueryTypes } from '../page.types';
import ProductsListing from '@/components/_global/ProductsListing';
import Markdown from '@/components/ui/markdown';
import { PRODUCT_CARD_QUERY } from '@/global/constants';

const page = { name: 'Produkty do szydelkowania', path: '/produkty-do-szydelkowania' };

const CrochetingPage = async () => {
  const {
    page: {
      HeroSimple: HeroSimpleData,
      StepsGrid: StepsGridData,
      LatestBlogEntries: LatestBlogEntriesData,
      listing_title,
      listing_text,
    },
    products,
  } = await query();

  const title = <Markdown.h2>{listing_title}</Markdown.h2>;
  const text = <Markdown>{listing_text}</Markdown>;

  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroSimple {...HeroSimpleData} />
      <StepsGrid {...StepsGridData} />
      <ProductsListing
        title={title}
        text={text}
        products={products}
      />
      <LatestBlogEntries {...LatestBlogEntriesData} />
    </>
  );
};

export default CrochetingPage;

const query = async (): Promise<CrochetingPage_QueryTypes> => {
  return await sanityFetch<CrochetingPage_QueryTypes>({
    query: /* groq */ `{
      "page": *[_type == "Crocheting_Page"][0] {
        ${HeroSimple_Query(true)}
        ${StepsGrid_Query}
        ${LatestBlogEntries_Query(true)}
        "listing_title" : listing_Heading_Products,
        "listing_text": listing_Paragraph_Products,
      },
      "products": *[_type == 'product' && visible == true && basis == 'crocheting' && type in ['variable', 'physical']][0...10]{
        ${PRODUCT_CARD_QUERY}
      }
    }
    `,
    tags: ['Crocheting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Crocheting_Page', page.path);
}