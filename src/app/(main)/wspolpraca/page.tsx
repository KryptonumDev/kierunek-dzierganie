import { draftMode } from 'next/headers';
import sanityFetch from '@/utils/sanity.fetch';
import Seo, { Seo_Query } from '@/global/Seo';
import type { PageQueryProps } from '@/global/types';
import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';

const page = { name: 'Współpraca', path: '/wspolpraca' };

const PartnersPage = async () => {
  const { content }: PageQueryProps = await query();

  return (
    <>
      <Breadcrumbs data={[{ name: page.name, path: page.path }]} />
      <Components data={content} />
    </>
  );
};

export default PartnersPage;

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
      *[_type == "Cooperation_Page"][0] {
        ${Components_Query}
        ${Seo_Query}
      }
    `,
    isDraftMode: draftMode().isEnabled,
  });
  return data as PageQueryProps;
};
