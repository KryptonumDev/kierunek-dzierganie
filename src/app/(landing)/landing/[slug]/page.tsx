import Components, { Components_Query } from '@/components/Components';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { PageQueryProps, generateStaticParamsProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { notFound } from 'next/navigation';

const LandingPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { content, name }: PageQueryProps = await query(slug);

  return (
    <>
      <Breadcrumbs
        data={[
          {
            name,
            path: `/landing/${slug}`,
          },
        ]}
        visible={false}
      />
      <Components data={content} />
    </>
  );
};

export default LandingPage;

export async function generateMetadata({ params: { slug: paramsSlug } }: { params: { slug: string } }) {
  return await QueryMetadata('landingPage', `/landing/${paramsSlug}`, paramsSlug);
}

const query = async (slug: string): Promise<PageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage" && slug.current == $slug][0] {
        name,
        'slug': slug.current,
        ${Components_Query}
      }
    `,
    params: { slug },
    tags: ['landingPage'],
  });
  !data && notFound();
  return data as PageQueryProps;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == "landingPage"] {
        'slug': slug.current,
        "dedicatedThankYouPage": content[] {
          newsletter{
            'slug': slug.current
          }
        }
      }
    `,
  });

  const landingPages = data.map(({ slug }) => ({
    slug,
  }));

  const thankYouPages = data
    .filter(({ dedicatedThankYouPage }) => !!dedicatedThankYouPage)
    .map(({ slug, dedicatedThankYouPage }) => ({
      slug: `${slug}/${dedicatedThankYouPage}`,
    }));

  return [...landingPages, ...thankYouPages];
}
