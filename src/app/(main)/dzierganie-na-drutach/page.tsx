import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import type { KnittingPage_QueryTypes } from './page.types';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';

const page = { name: 'Dzierganie na drutach', path: '/dzierganie-na-drutach' };

const KnittingPage = async () => {
  const { HeroSimple: HeroSimpleData, StepsGrid: StepsGridData } = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroSimple {...HeroSimpleData} />
      <StepsGrid {...StepsGridData} />
    </>
  );
};

export default KnittingPage;

const query = async (): Promise<KnittingPage_QueryTypes> => {
  return await sanityFetch<KnittingPage_QueryTypes>({
    query: /* groq */ `
      *[_type == "Knitting_Page"][0] {
        ${HeroSimple_Query}
        ${StepsGrid_Query}
      }
    `,
    tags: ['Knitting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Knitting_Page', page.path);
}
