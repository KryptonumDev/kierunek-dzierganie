import Breadcrumbs from '@/components/_global/Breadcrumbs';
import CategoriesSection, { CategoriesSection_Query } from '@/components/_global/CategoriesSection';
import HeroBackground, { HeroBackground_Query } from '@/components/_global/HeroBackground';
import { QueryMetadata } from '@/global/query-metadata';
import { type BlogPageQueryProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';

const page = { name: 'Blog', path: '/blog' };

export default async function BlogPage() {
  const { hero_Heading, hero_Paragraph, categories, categories_Heading, categories_Paragraph } = await getData();
  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroBackground data={{ hero_Heading, hero_Paragraph }} />
      <CategoriesSection data={{ categories, categories_Heading, categories_Paragraph }} />
    </>
  );
}

async function getData() {
  const data = await sanityFetch<BlogPageQueryProps>({
    query: /* groq */ `
      *[_id =="Blog_Page"][0] {
      ${HeroBackground_Query}
      ${CategoriesSection_Query}
      }
    `,
  });
  return data;
}

export const generateMetadata = async () => {
  return await QueryMetadata('Blog_Page', `${page.path}`);
};
