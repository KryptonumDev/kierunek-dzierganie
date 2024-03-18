import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/query-metadata';

const page = { name: 'Współpraca', path: '/wspolpraca' };

const CooperationPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};

export default CooperationPage;

export async function generateMetadata() {
  return await QueryMetadata('Cooperation_Page', `${page.path}`);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "Cooperation_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['Cooperation_Page'],
  });
  return data as PageQueryProps;
};
