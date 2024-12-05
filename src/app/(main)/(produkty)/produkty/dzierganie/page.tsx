import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import sanityFetch from '@/utils/sanity.fetch';
// import HeroSimple, { HeroSimple_Query } from '@/components/_global/HeroSimple';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import LogoSection, { LogoSection_Query } from '@/components/_global/LogoSection';
import ProductsListing from '@/components/_global/ProductsListing';
import StepsGrid, { StepsGrid_Query } from '@/components/_global/StepsGrid';
import Markdown from '@/components/ui/markdown';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import type { KnittingProductsPage_QueryTypes } from './page.types';

const breadcrumbs = [
  { name: 'Produkty', path: '/produkty' },
  { name: 'Dzierganie', path: '/dzierganie' },
];

const KnittingPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
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
  } = await query(searchParams);

  const title = <Markdown.h2>{listing_title}</Markdown.h2>;
  const text = <Markdown>{listing_text}</Markdown>;

  return (
    <>
      <Breadcrumbs data={breadcrumbs} />
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
        basis='/produkty/dzierganie/'
        courses={false}
        productsTotalCount={productsTotalCount}
        bestSeller={listing_HighlightedCourse}
        bestSellerBadge={listing_HighlightedCourse_Badge}
      />
      <LatestBlogEntries {...LatestBlogEntriesData} />
    </>
  );
};

export default KnittingPage;

const query = async (searchParams: { [key: string]: string }): Promise<KnittingProductsPage_QueryTypes> => {
  return await sanityFetch<KnittingProductsPage_QueryTypes>({
    query: /* groq */ `
    {
      "page": *[_type == "KnittingProducts_Page"][0] {
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
        ((_type == "product" && basis == 'knitting') || _type=='voucher')
        && visible == true 
        && (!defined($category) || category->slug.current == $category)
        && (!defined($discount) || type =='variable' || defined(discount))
        && (!defined($discount) || type =='physical' || defined(math::avg(variants[].discount)) )
      ][$before...$after]{
        ${PRODUCT_CARD_QUERY}
      },
      "productsTotalCount": count(*[
        ((_type == "product" && basis == 'knitting') || _type=='voucher')
        && visible == true 
        && (!defined($category) || category->slug.current == $category)
        && (!defined($discount) || type =='variable' || defined(discount))
        && (!defined($discount) || type =='physical' || defined(math::avg(variants[].discount)) )
      ]),
      "categories": *[_type == 'productCategory' && visibleInKnitting == true][]{
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
      discount: searchParams.promocja ?? null,
    },
    tags: ['KnittingProducts_Page', 'product', 'productCategory', 'voucher'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('KnittingProducts_Page', breadcrumbs[1]!.path);
}
