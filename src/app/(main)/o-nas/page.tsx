import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const page = { name: 'O nas', path: '/o-nas' };

const AboutUsPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};
export default AboutUsPage;

export async function generateMetadata() {
  return await QueryMetadata('AboutUs_Page', `${page.path}`);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "AboutUs_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['AboutUs_Page'],
  });
  return data as PageQueryProps;
};
