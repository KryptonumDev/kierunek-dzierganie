import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Components, { Components_Query } from '@/components/Components';
import type { PageQueryProps } from '@/global/types';

const page = { name: 'Szydełkowanie', path: '/szydelkowanie' };

const CrochetingPage = async () => {
  const { content } = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};
export default CrochetingPage;

const query = async (): Promise<PageQueryProps> => {
  return await sanityFetch<PageQueryProps>({
    query: /* groq */ `
      *[_type == "Crocheting_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['Crocheting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Crocheting_Page', page.path);
}
