import Components, { Components_Query } from '@/components/Components';
import Hero, { Hero_Query } from '@/components/_blogPost/Hero';
import PortableContent, { PortableContent_Query } from '@/components/_blogPost/PortableContent/PortableContent';
import { ShareArticle_Query } from '@/components/_blogPost/ShareArticle';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { Img_Query } from '@/components/ui/image';
import ArticleSchema from '@/global/Schema/ArticleSchema';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import { generateStaticParamsProps, type BlogPostQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';

export default async function BlogPostPage({ params: { slug } }: { params: { slug: string } }) {
  const { hero, author, date, content, previousBlog, nextBlog, links, portableText, OrganizationData } =
    await getData(slug);

  const page = [
    { name: 'Blog', path: '/blog' },
    { name: hero.heading, path: `/blog/${slug}` },
  ];

  return (
    <>
      <ArticleSchema
        hero={hero}
        OrganizationData={OrganizationData}
        date={date}
        author={author}
      />
      <Breadcrumbs data={page} />
      <Hero
        {...hero}
        author={author}
        date={date}
        portableText={portableText}
      />
      <PortableContent
        data={portableText}
        previousBlog={previousBlog}
        nextBlog={nextBlog}
        links={links}
      />
      <Components data={content} />
    </>
  );
}

export const generateMetadata = async ({ params: { slug } }: { params: { slug: string } }) => {
  return await QueryMetadata('BlogPost_Collection', `/blog/${slug}`, slug);
};

async function getData(slug: string) {
  const data = await sanityFetch<BlogPostQueryProps>({
    query: /* groq */ `
    *[_type == "BlogPost_Collection" && slug.current == $slug][0] {
      "date": _createdAt,
      author-> {
        heading,
        paragraph,
        img {
          ${Img_Query}
        },
      },
      ${Hero_Query}
      ${PortableContent_Query}
      ${ShareArticle_Query}
      "previousBlog": *[_type == "BlogPost_Collection" && _createdAt < ^. _createdAt]|order(_createdAt desc)[0]{
        "slug": slug.current,
        "name" : hero.heading
      },
      "nextBlog": *[_type == "BlogPost_Collection" && _createdAt > ^. _createdAt]|order(_createdAt asc)[0]{
        "slug": slug.current,
        "name" : hero.heading
      },
      ${Components_Query}
      "OrganizationData": *[_type=="global"][0] {
        OrganizationSchema {
          name,
          description
        },
      },
  }`,
    params: { slug },
    tags: ['BlogPost_Collection'],
  });
  return data;
}

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data = await sanityFetch<{ slug: string }[]>({
    query: /* groq */ `
      *[_type=="BlogPost_Collection"] {
          "slug": slug.current,
      }
    `,
  });
  return data.map(({ slug }) => ({
    slug,
  }));
}
