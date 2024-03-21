import sanityFetch from '@/utils/sanity.fetch';
import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import HeroBackground, { HeroBackground_Query } from '@/components/_global/HeroBackground';
import { type BlogPageQueryProps, generateStaticParamsBlogPagination } from '@/global/types';
import { POSTS_PER_PAGE } from '@/global/constants';

const page = { name: 'Blog', path: '/blog' };

export default async function BlogPageNumber({ params: { number } }: { params: { number: string } }) {
  const {
    hero_Heading,
    hero_Paragraph,
    blogPosts,
    categories_Heading,
    categories_Paragraph,
    blog_Heading,
    blog_Paragraph,
    blog_HighlightedPost,
  } = await query();

  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroBackground data={{ hero_Heading, hero_Paragraph }} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph }} />
      <BlogSection
        {...{
          heading: blog_Heading,
          paragraph: blog_Paragraph,
          highlightedPost: blog_HighlightedPost,
          number: parseInt(number),
          blogPosts: blogPosts,
        }}
      />
    </>
  );
}

async function query(): Promise<BlogPageQueryProps> {
  return await sanityFetch<BlogPageQueryProps>({
    query: /* groq */ `
      *[_type == "Blog_Page"][0] {
        ${HeroBackground_Query}
        ${CategoriesSection_Query}
        ${BlogSection_Query}
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
