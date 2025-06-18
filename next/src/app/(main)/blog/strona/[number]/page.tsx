import sanityFetch from '@/utils/sanity.fetch';
import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import { POSTS_PER_PAGE } from '@/global/constants';
import type { BlogPageQueryProps, generateStaticParamsBlogPagination } from '@/global/types';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Components, { Components_Query } from '@/components/Components';

export default async function BlogPageNumber({ params: { number } }: { params: { number: string } }) {
  const {
    HeroSimple: HeroSimpleData,
    blogPosts,
    categories_Heading,
    categories_Paragraph,
    blog_Heading,
    blog_Paragraph,
    blog_HighlightedPost,
    content,
  } = await query();

  const page = [
    { name: 'Blog', path: '/blog' },
    { name: `Strona: ${number}`, path: `/blog/strona/${number}` },
  ];

  return (
    <>
      <Breadcrumbs data={page} />
      <HeroSimple {...HeroSimpleData} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph }} />
      <BlogSection
        {...{
          heading: blog_Heading,
          paragraph: blog_Paragraph,
          highlightedPost: blog_HighlightedPost,
          number: parseInt(number),
          blogPosts: blogPosts,
          pathPrefix: '/blog/strona',
        }}
      />
      <Components data={content} />
    </>
  );
}

export const generateMetadata = async ({ params: { number } }: { params: { number: string } }) => {
  return await QueryMetadata('Blog_Page', `/blog/strona/${number}`);
};

async function query(): Promise<BlogPageQueryProps> {
  return await sanityFetch<BlogPageQueryProps>({
    query: /* groq */ `
      *[_type == "Blog_Page"][0] {
        ${HeroSimple_Query(true)}
        ${CategoriesSection_Query}
        ${BlogSection_Query}
        ${Components_Query}
      }
    `,
    tags: ['Blog_Page'],
  });
}

export async function generateStaticParams(): Promise<generateStaticParamsBlogPagination> {
  const blogPostCollectionItems = await sanityFetch<number>({
    query: /* groq */ `
      count(*[_type == "BlogPost_Collection"][])
    `,
  });
  const totalPages = Math.ceil(blogPostCollectionItems / POSTS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, index) => ({
    number: (index + 1).toString(),
  })).filter((_, index) => index !== 0);
}
