import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import type { CrochetingPage_QueryTypes } from './page.types';

const page = { name: 'Szydełkowanie', path: '/szydelkowanie' };

const CrochetingPage = async () => {
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

export default CrochetingPage;

const query = async (): Promise<CrochetingPage_QueryTypes> => {
  return await sanityFetch<CrochetingPage_QueryTypes>({
    query: /* groq */ `
      *[_type == "Crocheting_Page"][0] {
        ${HeroSimple_Query(true)}
        ${StepsGrid_Query}
        ${LatestBlogEntries_Query(true)}
      }
    `,
    tags: ['Crocheting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Crocheting_Page', page.path);
}
