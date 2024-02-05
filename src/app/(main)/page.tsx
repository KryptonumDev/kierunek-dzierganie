import { draftMode } from 'next/headers';
import sanityFetch from '@/utils/sanity.fetch';
import Seo, { Seo_Query } from '@/global/Seo';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/_global/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';

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
  const {
    seo: { title, description },
  } = await query();
  return Seo({
    title,
    description,
    path: page.path,
  });
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "homepage"][0] {
        name,
        ${Components_Query}
        ${Seo_Query}
      }
    `,
    isDraftMode: draftMode().isEnabled,
  });
  return data as PageQueryProps;
};
