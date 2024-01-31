import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Seo, { Seo_Query } from '@/global/Seo';
import type { PageQueryProps, generateStaticParamsProps } from '@/global/types';
import Components, { Components_Query } from '@/components/_global/Components';

const LandingPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { content }: PageQueryProps = await query(slug);

  return content?.map((content, i) => (
    <Components
      key={i}
      data={content}
      index={i}
    />
  ));
};

export default LandingPage;

export async function generateMetadata({ params: { slug: paramsSlug } }: { params: { slug: string } }) {
  const {
    slug,
    seo: { title, description },
  } = await query(paramsSlug);
  return Seo({
    title,
    description,
    path: `/landing/${slug}`,
  });
}

const query = async (slug: string): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage" && slug.current == $slug][0] {
        name,
        'slug': slug.current,
        ${Components_Query}
        ${Seo_Query}
      }
    `,
    params: { slug },
    isDraftMode: draftMode().isEnabled,
  });
  !data && notFound();
  return data as PageQueryProps;
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage"] {
        'slug': slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}