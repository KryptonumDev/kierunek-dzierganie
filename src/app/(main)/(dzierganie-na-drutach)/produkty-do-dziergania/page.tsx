import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import type { KnittingPage_QueryTypes } from '../page.types';
import ProductsListing, { ProductsListing_Query } from '@/components/_global/ProductsListing';
import Markdown from '@/components/ui/markdown';

const page = { name: 'Produkty do dziergania', path: '/produkty-do-dziergania' };

const KnittingPage = async () => {
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

export default KnittingPage;

const query = async (): Promise<KnittingPage_QueryTypes> => {
  return await sanityFetch<KnittingPage_QueryTypes>({
    query: /* groq */ `
    {
      "page": *[_type == "Knitting_Page"][0] {
        ${HeroSimple_Query(true)}
        ${StepsGrid_Query}
        ${LatestBlogEntries_Query(true)}
        "listing_title" : listing_Heading_Products,
        "listing_text": listing_Paragraph_Products,
      },
      "products": *[_type== 'product' && visible == true && basis == 'knitting' && type in ['variable', 'physical']][0...10]{
        ${ProductsListing_Query}
      }
    }
    `,
    tags: ['Knitting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Knitting_Page', page.path);
}