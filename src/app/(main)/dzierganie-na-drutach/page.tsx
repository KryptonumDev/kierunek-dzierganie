import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Components, { Components_Query } from '@/components/Components';
import type { PageQueryProps } from '@/global/types';

const page = { name: 'Dzierganie na drutach', path: '/dzierganie-na-drutach' };

const KnittingPage = async () => {
  const { content } = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};
export default KnittingPage;

const query = async (): Promise<PageQueryProps> => {
  return await sanityFetch<PageQueryProps>({
    query: /* groq */ `
      *[_type == "Knitting_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['Knitting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Knitting_Page', page.path);
}
