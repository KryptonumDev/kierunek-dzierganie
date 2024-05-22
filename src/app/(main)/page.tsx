import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Components, { Components_Query } from '@/components/Components';
import type { PageQueryProps } from '@/global/types';

const page = { name: 'Strona główna', path: '/o-mnie' };

const IndexPage = async () => {
  const { content } = await query();

  return (
    <>
      <Breadcrumbs />
      <Components data={content} />
    </>
  );
};

export default IndexPage;

export async function generateMetadata() {
  return await QueryMetadata('homepage', page.path);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch<PageQueryProps>({
    query: /* groq */ `
      *[_type == "homepage"][0] {
        ${Components_Query}
      }
    `,
    tags: ['homepage'],
  });
  return data; 
};
