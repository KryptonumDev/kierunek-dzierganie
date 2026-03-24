import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import { POSTS_PER_PAGE } from '@/global/constants';
import type {
  BlogsCategoryStaticParamsType,
  BlogCategoryPageQueryProps,
  generateBlogCategoryPageStaticParamsProps,
} from '@/global/types';
import Components, { Components_Query } from '@/components/Components';

export default async function CategoryPaginationBlogPage({
  params: { slug, number },
}: {
  params: { slug: string; number: string };
}) {
  const {
    HeroSimple: HeroSimpleData,
    blogPosts,
    categories_Heading,
    categories_Paragraph,
    blog_Heading,
    blog_Paragraph,
    blog_HighlightedPost,
    name,
    filteredBlogPosts,
    content,
  } = await getData(slug);

  const page = [
    { name: 'Blog', path: '/blog' },
    { name: `Kategoria: ${name}`, path: `/blog/kategoria/${slug}` },
    { name: `Strona: ${number}`, path: `/blog/kategoria/${slug}/strona/${number}` },
  ];
  return (
    <>
      <Breadcrumbs data={page} />
      <HeroSimple {...HeroSimpleData} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph, highlightedCategory: slug }} />
      <BlogSection
        {...{
          heading: blog_Heading,
          paragraph: blog_Paragraph,
          highlightedPost: blog_HighlightedPost,
          blogPosts: filteredBlogPosts,
          pathPrefix: `/blog/kategoria/${slug}`,
          number: parseInt(number),
          addPagePrefix: false,
        }}
      />
      <Components data={content} />
    </>
  );
}

export const generateMetadata = async ({ params: { slug, number } }: { params: { slug: string; number: string } }) => {
  return await QueryMetadata('BlogCategory_Collection', `/blog/kategoria/${slug}/strona/${number}`, slug);
};

async function getData(slug: string) {
  const data = await sanityFetch<BlogCategoryPageQueryProps>({
    query: /* groq */ `
      *[_type == 'BlogCategory_Collection' && slug.current == $slug][0] {
        name,
        "filteredBlogPosts": *[_type == "BlogPost_Collection" && $slug in category[] -> slug.current],
        ${HeroSimple_Query(true)}
        ${CategoriesSection_Query}
        ${BlogSection_Query}
        ${Components_Query}
      }
    `,
    params: { slug },
    tags: ['BlogCategory_Collection'],
  });
  !data?.HeroSimple && notFound();
  return data;
}

export async function generateStaticParams(): Promise<generateBlogCategoryPageStaticParamsProps[]> {
  const data = await sanityFetch<BlogsCategoryStaticParamsType[]>({
    query: /* groq */ `
      *[_type=="BlogPost_Collection"][] {
        "categories": category[]-> {
          name,
          "slug": slug.current,
        }
      }
    `,
    tags: ['BlogPost_Collection', 'BlogCategory_Collection'],
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
