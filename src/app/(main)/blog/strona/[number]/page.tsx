import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import HeroBackground, { HeroBackground_Query } from '@/components/_global/HeroBackground';
import {
  type BlogsCategoryStaticParamsType,
  type BlogPageQueryProps,
  type generateBlogPaginationStaticParamsProps,
} from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { blogsPerPage } from 'app-config';

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
  } = await getData();
  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroBackground data={{ hero_Heading, hero_Paragraph }} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph }} />
      <BlogSection data={{ blog_Heading, blog_Paragraph, blog_HighlightedPost, blogPosts, number: parseInt(number) }} />
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

export async function generateStaticParams(): Promise<generateBlogPaginationStaticParamsProps[]> {
  const data = await sanityFetch<BlogsCategoryStaticParamsType[]>({
    query: /* groq */ `
      *[_type=="BlogPost_Collection"][] {
        "categories": category[]-> {
          name,
          "slug": slug.current,
        }
      }`,
  });
  return Array.from({ length: Math.ceil(data.length / blogsPerPage) }, (value, index) => ({
    number: (index + 1).toString(),
  })).filter(({ number }) => number !== '1');
}
