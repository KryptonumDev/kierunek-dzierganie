import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import type { KnittingPage_QueryTypes } from './page.types';

const page = { name: 'Dzierganie na drutach', path: '/dzierganie-na-drutach' };

const KnittingPage = async () => {
  const {
    HeroSimple: HeroSimpleData,
    StepsGrid: StepsGridData,
    LatestBlogEntries: LatestBlogEntriesData,
  } = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroSimple {...HeroSimpleData} />
      <StepsGrid {...StepsGridData} />
      <LatestBlogEntries {...LatestBlogEntriesData} />
    </>
  );
};

export default KnittingPage;

const query = async (): Promise<KnittingPage_QueryTypes> => {
  return await sanityFetch<KnittingPage_QueryTypes>({
    query: /* groq */ `
      *[_type == "Knitting_Page"][0] {
        ${HeroSimple_Query(true)}
        ${StepsGrid_Query}
        ${LatestBlogEntries_Query(true)}
      }
    `,
    tags: ['Knitting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Knitting_Page', page.path);
}
