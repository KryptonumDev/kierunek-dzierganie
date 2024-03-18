import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/query-metadata';

const page = { name: 'O mnie', path: '/o-mnie' };

const AboutMePage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};
export default AboutMePage;

export async function generateMetadata() {
  return await QueryMetadata('AboutMe_Page', `${page.path}`);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "AboutMe_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['AboutMe_Page'],
  });
  return data as PageQueryProps;
};
