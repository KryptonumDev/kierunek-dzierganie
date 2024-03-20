import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import HeroBackground, { HeroBackground_Query } from '@/components/_global/HeroBackground';
import { QueryMetadata } from '@/global/query-metadata';
import {
  type generateStaticParamsProps,
  type BlogsCategoryStaticParamsType,
  type BlogCategoryPageQueryProps,
} from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';

export default async function CategoryBlogPage({ params: { slug } }: { params: { slug: string } }) {
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
  } = await getData(slug);

  const page = [
    { name: 'Blog', path: '/blog' },
    { name: `Kategoria: ${name}`, path: `/blog/kategoria/${slug}` },
  ];
  return (
    <>
      <Breadcrumbs data={page} />
      <HeroBackground data={{ hero_Heading, hero_Paragraph }} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph }} />
      <BlogSection data={{ blog_Heading, blog_Paragraph, blog_HighlightedPost }} />
    </>
  );
}

async function getData(slug: string) {
  const data = await sanityFetch<BlogCategoryPageQueryProps>({
    query: /* groq */ `
        *[_type=='BlogCategory_Collection' && slug.current == $slug][0] {
          name,
          ${HeroBackground_Query}
          ${CategoriesSection_Query}
          ${BlogSection_Query}
        }
    `,
    params: { slug },
    tags: ['Blog_Page'],
  });
  return data;
}

export const generateMetadata = async ({ params: { slug } }: { params: { slug: string } }) => {
  return await QueryMetadata('BlogCategory_Collection', `/blog/kategoria/${slug}`, `${slug}`);
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data = await sanityFetch<BlogsCategoryStaticParamsType[]>({
    query: /* groq */ `
      *[_type=="BlogPost_Collection"][] {
        "categories": category[]-> {
          name,
          "slug": slug.current,
        }
      }`,
  });
  const allCategories = data.flatMap((post) => post.categories || []);
  const uniqueCategories = allCategories.filter(
    (category, index, self) => index === self.findIndex((c) => c.name === category.name)
  );
  return uniqueCategories.map(({ slug }) => ({
    slug,
  }));
}
