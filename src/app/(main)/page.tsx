import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/query-metadata';

const page = { name: 'Strona główna', path: '/o-mnie' };

const IndexPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs />
      <Components data={content} />
    </>
  );
};
export default IndexPage;

export async function generateMetadata() {
  return await QueryMetadata('homepage', `${page.path}`);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "homepage"][0] {
        ${Components_Query}
      }
    `,
    tags: ['homepage'],
  });
  return data as PageQueryProps;
};
