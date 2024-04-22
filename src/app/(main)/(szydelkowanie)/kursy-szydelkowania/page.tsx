import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import type { CrochetingPage_QueryTypes } from '../page.types';
import ProductsListing from '@/components/_global/ProductsListing';
import Markdown from '@/components/ui/markdown';
import { PRODUCT_CARD_QUERY } from '@/global/constants';

const page = { name: 'Szydełkowanie', path: '/kursy-szydelkowania' };

const CrochetingPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const {
    page: {
      HeroSimple: HeroSimpleData,
      StepsGrid: StepsGridData,
      LatestBlogEntries: LatestBlogEntriesData,
      listing_title,
      listing_text,
    },
    products,
    categories,
    productsTotalCount,
    authors,
  } = await query(searchParams);

  const title = <Markdown.h2>{listing_title}</Markdown.h2>;
  const text = <Markdown>{listing_text}</Markdown>;

  return (
    <>
      <Breadcrumbs data={[page]} />
      <HeroSimple {...HeroSimpleData} />
      <StepsGrid {...StepsGridData} />
      <ProductsListing
        title={title}
        text={text}
        products={products}
        categories={categories}
        basis='/kursy-szydelkowania/'
        courses={true}
        productsTotalCount={productsTotalCount}
        authors={authors}
      />
      <LatestBlogEntries {...LatestBlogEntriesData} />
    </>
  );
};

export default CrochetingPage;

const query = async (searchParams: { [key: string]: string }): Promise<CrochetingPage_QueryTypes> => {
  return await sanityFetch<CrochetingPage_QueryTypes>({
    query: /* groq */ `{
      "page": *[_type == "Crocheting_Page"][0] {
        ${HeroSimple_Query(true)}
        ${StepsGrid_Query}
        ${LatestBlogEntries_Query(true)}
        "listing_title" : listing_Heading_Courses,
        "listing_text": listing_Paragraph,
      },
      "products": *[
        (_type == 'course' || _type == 'bundle' )
        && visible == true 
        && basis == 'crocheting' 
        && (!defined($bundle) || _type == 'bundle')
        && (!defined($category) || _type == 'bundle' || category->slug.current == $category)
        && (!defined($category) || _type == 'course' || $category in categories[]->slug.current)
        && (!defined($complexity) || complexity == $complexity)
        && (!defined($author) || author->slug.current == $author)
        && (!defined($discount) || defined(discount))
      ][$before...$after]{
        ${PRODUCT_CARD_QUERY}
      },
      "productsTotalCount": count(*[
        (_type == 'course' || _type == 'bundle' )
        && visible == true 
        && basis == 'crocheting' 
        && (!defined($bundle) || _type == 'bundle')
        && (!defined($category) || _type == 'bundle' || category->slug.current == $category)
        && (!defined($category) || _type == 'course' || $category in categories[]->slug.current)
        && (!defined($complexity) || complexity == $complexity)
        && (!defined($author) || author->slug.current == $author)
        && (!defined($discount) || defined(discount))
      ]),
      "categories": *[_type == 'courseCategory'][]{
        name,
        "slug": slug.current,
        _id
      },
      "authors": *[_type == 'CourseAuthor_Collection'][]{
        name,
        "slug": slug.current,
        _id
      }
    }
    `,
    params: {
      before: (Number(searchParams.strona ?? 1) - 1) * 10,
      after: Number(searchParams.strona ?? 1) * 10,
      category: searchParams.rodzaj ?? null,
      complexity: searchParams['poziom-trudnosci'] ?? null,
      author: searchParams.autor ?? null,
      bundle: searchParams.pakiet ?? null,
      discount: searchParams.promocja ?? null,
    },
    tags: ['Crocheting_Page'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('Crocheting_Page', page.path);
}
