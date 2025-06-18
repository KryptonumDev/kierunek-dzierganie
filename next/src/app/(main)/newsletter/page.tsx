import sanityFetch from '@/utils/sanity.fetch';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const page = { name: 'Newsletter', path: '/newsletter' };

const NewsletterPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <Components data={content} />
    </>
  );
};
export default NewsletterPage;

export async function generateMetadata() {
  return await QueryMetadata('Newsletter_Page', `${page.path}`);
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "Newsletter_Page"][0] {
        ${Components_Query}
      }
    `,
    tags: ['Newsletter_Page'],
  });
  return data as PageQueryProps;
};
