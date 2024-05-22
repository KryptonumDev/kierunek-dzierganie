import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
// import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import type { CrochetingPage_QueryTypes } from '../page.types';
import ProductsListing from '@/components/_global/ProductsListing';
import Markdown from '@/components/ui/markdown';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import { createClient } from '@/utils/supabase-server';
import LogoSection, { LogoSection_Query } from '@/components/_global/LogoSection';

const page = { name: 'Szydełkowanie', path: '/kursy-szydelkowania' };

const CrochetingPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const {
    page: {
      LogoSection: LogoSectionData,
      // HeroSimple: HeroSimpleData,
      StepsGrid: StepsGridData,
      LatestBlogEntries: LatestBlogEntriesData,
      listing_title,
      listing_text,
      listing_HighlightedCourse,
      listing_HighlightedCourse_Badge,
    },
    products,
    categories,
    productsTotalCount,
    authors,
  } = await query(searchParams);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const res = await supabase
    .from('profiles')
    .select(
      `
        id,
        courses_progress (
          course_id
        )
      `
    )
    .eq('id', user?.id)
    .single();

  const title = <Markdown.h2>{listing_title}</Markdown.h2>;
  const text = <Markdown>{listing_text}</Markdown>;

  return (
    <>
      <Breadcrumbs data={[page]} />
      <LogoSection
        {...LogoSectionData}
        isHero={true}
      />
      {/* <HeroSimple {...HeroSimpleData} /> */}
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
        ownedCourses={res.data?.courses_progress?.map((course) => course.course_id as string)}
        bestSeller={listing_HighlightedCourse}
        bestSellerBadge={listing_HighlightedCourse_Badge}
      />
      <LatestBlogEntries {...LatestBlogEntriesData} />
    </>
  );
};

export default CrochetingPage;

const query = async (searchParams: { [key: string]: string }): Promise<CrochetingPage_QueryTypes> => {
  return await sanityFetch<CrochetingPage_QueryTypes>({
    query: /* groq */ `{
      "page": *[_type == "CrochetingCourses_Page"][0] {
        ${LogoSection_Query(true)}
        ${StepsGrid_Query}
        ${LatestBlogEntries_Query(true)}
        "listing_title" : listing_Heading_Courses,
        "listing_text": listing_Paragraph,
        listing_HighlightedCourse -> {
          ${PRODUCT_CARD_QUERY}
        },
        listing_HighlightedCourse_Badge,
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
      "categories": *[_type == 'courseCategory' && visibleInCrocheting == true][]{
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
      before: (Number(searchParams.strona ?? 1) - 1) * 9,
      after: Number(searchParams.strona ?? 1) * 9,
      category: searchParams.rodzaj ?? null,
      complexity: searchParams['poziom-trudnosci'] ?? null,
      author: searchParams.autor ?? null,
      bundle: searchParams.pakiet ?? null,
      discount: searchParams.promocja ?? null,
    },
    tags: ['CrochetingCourses_Page', 'course', 'bundle', 'courseCategory', 'CourseAuthor_Collection'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('CrochetingCourses_Page', page.path);
}
