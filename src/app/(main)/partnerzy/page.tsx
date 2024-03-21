import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

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
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "Partners_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['Partners_Page'],
  });
  return data as PageQueryProps;
};
