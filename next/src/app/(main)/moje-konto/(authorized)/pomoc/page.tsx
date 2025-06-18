import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import type { SupportPage_QueryTypes } from './page.types';
import Tabs, { Tabs_Query } from '@/components/_dashboard/Tabs';
import Breadcrumbs from '@/components/_global/Breadcrumbs';

const currentPath = '/moje-konto/pomoc';
const page = [{ name: 'Pomoc', path: currentPath }];

export default async function SupportPage() {
  const { HeroSimple: HeroSimpleData, tabs } = await query();

  return (
    <div className='main'>
      <Breadcrumbs
        visible={false}
        data={page}
      />
      <HeroSimple {...HeroSimpleData} />
      <Tabs {...{ tabs }} />
    </div>
  );
}
const query = async (): Promise<SupportPage_QueryTypes> => {
  return await sanityFetch<SupportPage_QueryTypes>({
    query: /* groq */ `
      *[_type == "Support_Page"][0] {
        ${HeroSimple_Query(true)}
        ${Tabs_Query}
      }
    `,
    tags: ['Support_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Support_Page', currentPath);
}
