import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import type { KnittingPage_QueryTypes } from './page.types';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import ProductsListing, { ProductsListing_Query } from '@/components/_global/ProductsListing';

const page = { name: 'Dzierganie na drutach', path: '/dzierganie-na-drutach' };

const KnittingPage = async () => {
  const { page: {HeroSimple: HeroSimpleData, StepsGrid: StepsGridData}, products } = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroSimple {...HeroSimpleData} />
      <StepsGrid {...StepsGridData} />
      <ProductsListing products={products} />
    </>
  );
};

export default KnittingPage;

const query = async (): Promise<KnittingPage_QueryTypes> => {
  return await sanityFetch<KnittingPage_QueryTypes>({
    query: /* groq */ `
    {
      "page": *[_type == "Knitting_Page"][0] {
        ${HeroSimple_Query}
        ${StepsGrid_Query}
      },
      "products": *[_type== 'product'][0...10]{
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
