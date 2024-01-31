import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Seo, { Seo_Query } from '@/global/Seo';
import type { PageQueryProps } from '@/global/types';
import Components, { Componenets_Query } from '@/components/_global/Components';

const IndexPage = async () => {
  const { content }: PageQueryProps = await query();
  
  return content.map((content, i) => (
    <Components
      key={i}
      data={content}
      index={i}
    />
  ));
};

export async function generateMetadata() {
  const {
    seo: { title, description },
  } = await query();
  return Seo({
    title,
    description,
    path: '/',
  });
}

const query = async (): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "homepage"][0] {
        name,
        ${Componenets_Query}
        ${Seo_Query}
      }
    `,
    isDraftMode: draftMode().isEnabled,
  });
  !data && notFound();
  return data as PageQueryProps;
};

export default IndexPage;