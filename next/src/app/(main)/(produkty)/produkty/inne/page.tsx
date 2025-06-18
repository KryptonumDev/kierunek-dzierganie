import Breadcrumbs from '@/components/_global/Breadcrumbs';
import LatestBlogEntries, { LatestBlogEntries_Query } from '@/components/_global/LatestBlogEntries';
import LogoSection, { LogoSection_Query } from '@/components/_global/LogoSection';
import ProductsListing from '@/components/_global/ProductsListing';
import Markdown from '@/components/ui/markdown';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import sanityFetch from '@/utils/sanity.fetch';
import type { OtherProductsPage_QueryTypes } from './page.types';

const breadcrumbs = [
  { name: 'Produkty', path: '/produkty' },
  { name: 'Inne produkty', path: '/produkty/inne' },
];

const OtherProductsPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const {
    page: {
      LogoSection: LogoSectionData,
      LatestBlogEntries: LatestBlogEntriesData,
      listing_title,
      listing_text,
      listing_HighlightedCourse,
      listing_HighlightedCourse_Badge,
    },
    products,
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
      <ProductsListing
        title={title}
        text={text}
        products={products}
        basis='inne/'
        courses={false}
        productsTotalCount={productsTotalCount}
        bestSeller={listing_HighlightedCourse}
        bestSellerBadge={listing_HighlightedCourse_Badge}
      />
      <LatestBlogEntries {...LatestBlogEntriesData} />
    </>
  );
};

export default OtherProductsPage;

const query = async (searchParams: { [key: string]: string }): Promise<OtherProductsPage_QueryTypes> => {
  return await sanityFetch<OtherProductsPage_QueryTypes>({
    query: /* groq */ `{
      "page": *[_type == "OtherProducts_Page"][0] {
        ${LogoSection_Query(true)}
        ${LatestBlogEntries_Query(true)}
        "listing_title" : listing_Heading_Courses,
        "listing_text": listing_Paragraph,
        listing_HighlightedCourse -> {
          ${PRODUCT_CARD_QUERY}
        },
        listing_HighlightedCourse_Badge,
      },
      "products": *[
        ((_type == "product" && basis == 'other'))
        && visible == true 
        && (!defined($category) || category->slug.current == $category)
        && (!defined($discount) || type =='variable' || defined(discount))
        && (!defined($discount) || type =='physical' || defined(math::avg(variants[].discount)) )
      ][$before...$after]{
        ${PRODUCT_CARD_QUERY}
      },
      "productsTotalCount": count(*[
        ((_type == "product" && basis == 'other'))
        && visible == true 
        && (!defined($category) || category->slug.current == $category)
        && (!defined($discount) || type =='variable' || defined(discount))
        && (!defined($discount) || type =='physical' || defined(math::avg(variants[].discount)) )
      ]),
    }
    `,
    params: {
      before: (Number(searchParams.strona ?? 1) - 1) * 9,
      after: Number(searchParams.strona ?? 1) * 9,
      category: searchParams.rodzaj ?? null,
      discount: searchParams.promocja ?? null,
    },
    tags: ['OtherProducts_Page', 'product', 'productCategory'],
  });
};

export async function generateMetadata() {
  return await QueryMetadata('OtherProducts_Page', breadcrumbs[1]!.path);
}
