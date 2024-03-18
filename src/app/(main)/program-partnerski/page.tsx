import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/query-metadata';

const page = { name: 'Program partnerski', path: '/program-partnerski' };

const AffiliatePage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};
export default AffiliatePage;

export async function generateMetadata() {
  return await QueryMetadata('Affiliate_Page', `${page.path}`);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "Affiliate_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['Affiliate_Page'],
  });
  return data as PageQueryProps;
};
