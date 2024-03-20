import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import HeroBackground, { HeroBackground_Query } from '@/components/_global/HeroBackground';
import { QueryMetadata } from '@/global/query-metadata';
import { type BlogPageQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';

const page = { name: 'Blog', path: '/blog' };

export default async function BlogPage() {
  const {
    hero_Heading,
    hero_Paragraph,
    blogPosts,
    categories_Heading,
    categories_Paragraph,
    blog_Heading,
    blog_Paragraph,
    blog_HighlightedPost,
  } = await getData();
  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroBackground data={{ hero_Heading, hero_Paragraph }} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph }} />
      <BlogSection data={{ blog_Heading, blog_Paragraph, blog_HighlightedPost }} />
    </>
  );
}

async function getData() {
  const data = await sanityFetch<BlogPageQueryProps>({
    query: /* groq */ `
      *[_id =="Blog_Page"][0] {
      ${HeroBackground_Query}
      ${CategoriesSection_Query}
      ${BlogSection_Query}
      }
    `,
    tags: ['Blog_Page'],
  });
  return data;
}

export const generateMetadata = async () => {
  return await QueryMetadata('Blog_Page', `${page.path}`);
};
