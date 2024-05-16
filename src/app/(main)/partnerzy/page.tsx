import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import { notFound } from 'next/navigation';

const page = { name: 'Partnerzy', path: '/partnerzy' };

const PartnersPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};
export default PartnersPage;

export async function generateMetadata() {
  return await QueryMetadata('Partners_Page', `${page.path}`);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch<PageQueryProps & { displayPage: boolean }>({
    query: /* groq */ `
      *[_type == "Partners_Page"][0] {
        displayPage,
        ${Components_Query}
      }
    `,
    tags: ['Partners_Page'],
  });

  if (!data.displayPage) {
    notFound();
  }

  return data as PageQueryProps;
};
