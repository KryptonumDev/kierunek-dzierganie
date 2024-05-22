import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Introduction, { Introduction_Query } from '@/components/_global/Introduction';
import ImageShowcase, { ImageShowcase_Query } from '@/components/_global/ImageShowcase';
import type { generateStaticParamsProps } from '@/global/types';
import type { StudentPageQueryTypes, StudentPageTypes } from './page.types';

export default async function StudentPage({ params: { slug } }: StudentPageTypes) {
  const { name, content } = await query(slug);

  return (
    <>
      <Breadcrumbs data={[
        { name: `Historia ${name}`, path: `/historia-kursantek/${slug}` },
      ]} />
      <Introduction {...content.Introduction} />
      {content.ImageShowcase && <ImageShowcase {...content.ImageShowcase} />}
    </>
  );
}

async function query(slug: string): Promise<StudentPageQueryTypes> {
  const data = await sanityFetch<StudentPageQueryTypes>({
    query: /* groq */ `
      *[_type == "CustomerCaseStudy_Collection" && slug.current == $slug][0] {
        name,
        userId,
        content {
          ${Introduction_Query(true)}
          ${ImageShowcase_Query(true)}
        }
      }
    `,
    params: { slug },
    tags: ['CustomerCaseStudy_Collection'],
  });
  if (!data) notFound();
  if (data.userId) {
    // Query to fetch user finished courses.
    console.log(data.userId);
  }
  return data;
}

export const generateMetadata = async ({ params: { slug } }: StudentPageTypes) => {
  return await QueryMetadata('CustomerCaseStudy_Collection', `/historia-kursantek/${slug}`, slug);
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data = await sanityFetch<generateStaticParamsProps[]>({
    query: /* groq */ `
      *[_type == "CustomerCaseStudy_Collection"] {
        "slug": slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
