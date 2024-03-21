import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import HeroBackground, { HeroBackground_Query } from '@/components/_global/HeroBackground';
import {
  type BlogsCategoryStaticParamsType,
  type BlogCategoryPageQueryProps,
  type generateBlogCategoryPageStaticParamsProps,
} from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { POSTS_PER_PAGE } from '@/global/constants';
import { notFound } from 'next/navigation';
import { QueryMetadata } from '@/global/Seo/query-metadata';

export default async function CategoryPaginationBlogPage({
  params: { slug, number },
}: {
  params: { slug: string; number: string };
}) {
  const {
    hero_Heading,
    hero_Paragraph,
    blogPosts,
    categories_Heading,
    categories_Paragraph,
    blog_Heading,
    blog_Paragraph,
    blog_HighlightedPost,
    name,
    filteredBlogPosts,
  } = await getData(slug);

  const page = [
    { name: 'Blog', path: '/blog' },
    { name: `Kategoria: ${name}`, path: `/blog/kategoria/${slug}` },
  ];
  return (
    <>
      <Breadcrumbs data={page} />
      <HeroBackground data={{ hero_Heading, hero_Paragraph }} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph, highlightedCategory: slug }} />
      <BlogSection
        {...{
          heading: blog_Heading,
          paragraph: blog_Paragraph,
          highlightedPost: blog_HighlightedPost,
          blogPosts: filteredBlogPosts,
          pathPrefix: `/blog/kategoria/${slug}`,
          number: parseInt(number),
          isCategoryPagination: true,
        }}
      />
    </>
  );
}

async function getData(slug: string) {
  const data = await sanityFetch<BlogCategoryPageQueryProps>({
    query: /* groq */ `
        *[_type=='BlogCategory_Collection' && slug.current == $slug][0] {
          name,
          "filteredBlogPosts": *[_type=="BlogPost_Collection" && $slug in category[]->slug.current],
          ${HeroBackground_Query}
          ${CategoriesSection_Query}
          ${BlogSection_Query}
        }
    `,
    params: { slug },
    tags: ['Blog_Page'],
  });
  data?.hero_Heading || notFound();
  return data;
}

export const generateMetadata = async ({ params: { slug, number } }: { params: { slug: string; number: string } }) => {
  return await QueryMetadata('BlogCategory_Collection', `/blog/kategoria/${slug}/${number}`, slug);
};

export async function generateStaticParams(): Promise<generateBlogCategoryPageStaticParamsProps[]> {
  const data = await sanityFetch<BlogsCategoryStaticParamsType[]>({
    query: /* groq */ `
      *[_type=="BlogPost_Collection"][] {
        "categories": category[]-> {
          name,
          "slug": slug.current,
        }
      }`,
  });
  return data
    .flatMap((entry) =>
      entry.categories.map((category) => {
        const categorySlug = category.slug;
        return { slug: categorySlug };
      })
    )
    .map((obj, index, array) => ({
      ...obj,
      number: Math.ceil((array.filter((o) => o.slug === obj.slug).indexOf(obj) + 1) / POSTS_PER_PAGE).toString(),
    }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((v) => v.number === value.number && v.slug === value.slug) && value.number !== '1'
    );
}
