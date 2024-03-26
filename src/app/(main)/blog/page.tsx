import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import BlogSection, { BlogSection_Query } from '@/components/_global/BlogSection';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import type { BlogPageQueryProps } from '@/global/types';

const page = { name: 'Blog', path: '/blog' };

export default async function BlogPage() {
  const {
    HeroSimple: HeroSimpleData,
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
      <HeroSimple {...HeroSimpleData} />
      <CategoriesSection data={{ blogPosts, categories_Heading, categories_Paragraph }} />
      <BlogSection
        {...{
          heading: blog_Heading,
          paragraph: blog_Paragraph,
          highlightedPost: blog_HighlightedPost,
          blogPosts: blogPosts,
          pathPrefix: '/blog/strona',
        }}
      />
    </>
  );
}

const query = async (): Promise<BlogPageQueryProps> => {
  return await sanityFetch<BlogPageQueryProps>({
    query: /* groq */ `
      *[_type == "Blog_Page"][0] {
        ${HeroSimple_Query(true)}
        ${CategoriesSection_Query}
        ${BlogSection_Query}
      }
    `,
    tags: ['Blog_Page'],
  });
};

export const generateMetadata = async () => {
  return await QueryMetadata('Blog_Page', page.path);
};
