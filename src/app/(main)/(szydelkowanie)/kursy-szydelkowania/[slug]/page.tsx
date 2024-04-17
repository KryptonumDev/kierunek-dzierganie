import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroPhysical from '@/components/_product/HeroPhysical';
import Parameters from '@/components/_product/Parameters';
import Informations from '@/components/_product/Informations';
import Description, { Description_Query } from '@/components/_product/Description';
import TableOfContent from '@/components/_product/TableOfContent';
import type { ProductPageQueryProps, generateStaticParamsProps } from '@/global/types';
import Package, { Package_Query } from '@/components/_product/Package';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import Reviews from '@/components/_product/Reviews';

const Product = async ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    product: {
      name,
      _id,
      type,
      variants,
      price,
      discount,
      featuredVideo,
      countInStock,
      gallery,
      parameters,
      description,
      course,
      courses,
    },
    card,
  } = await query(slug);

  return (
    <>
      <Breadcrumbs
        data={[
          {
            name: 'Szydełkowanie',
            path: '/kursy-szydelkowania',
          },
          {
            name,
            path: `/kursy-szydelkowania/${slug}`,
          },
        ]}
        visible={true}
      />
      <HeroPhysical
        name={name}
        id={_id}
        type={type}
        variants={variants}
        physical={{
          name,
          price,
          discount,
          countInStock,
          featuredVideo,
          gallery,
        }}
      />
      <Informations tabs={['Spis treści', 'Pakiet', 'Opis', 'Parametry', 'Opinie']}>
        {course && <TableOfContent chapters={course.chapters} />}
        {courses && (
          <Package
            product={card}
            heading={'Jeden pakiet – niezliczona ilość wiedzy'}
            paragraph={
              'Zdobądź niezbędne umiejętności i rozwijaj kreatywność z **pakietem kursów** – w korzystnej cenie!'
            }
            courses={courses}
          />
        )}
        {description?.length > 0 && <Description data={description} />}
        {parameters?.length > 0 && <Parameters parameters={parameters} />}
        {course?.reviews && course?.reviews.length > 0 && <Reviews reviews={course.reviews} />}
      </Informations>
      {/* TODO: Add featured courses */}
    </>
  );
};

export default Product;

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return await QueryMetadata('product', `/kursy-szydelkowania/${slug}`, slug);
}

const query = async (slug: string): Promise<ProductPageQueryProps> => {
  const data = await sanityFetch<ProductPageQueryProps>({
    query: /* groq */ `
    {
      "product": *[_type == 'product' && basis == 'crocheting' && type in ['digital', 'bundle'] && slug.current == $slug][0] {
        name,
        'slug': slug.current,
        _id,
        basis,
        type,
        price,
        discount,
        featuredVideo,
        countInStock,
        gallery[]{
          asset -> {
            url,
            altText,
            metadata {
              lqip,
              dimensions {
                width,
                height,
              }
            }
          }
        },
        ${Package_Query}
        ${Description_Query}
        course -> {
          chapters[] {
            chapterName,
            lessons[] -> {
              title,
              lengthInMinutes,
            },
          },
          "reviews": *[_type == 'courseReviewCollection' && references(^._id)][0...10]{
            rating,
            review,
            nameOfReviewer,
            _id
          },
          "rating": math::avg(*[_type == 'courseReviewCollection' && references(^._id)]{rating}.rating)
        },
        parameters[]{
          name,
          value,
        },
        variants[]{
          name,
          price,
          discount,
          countInStock,
          featuredVideo,
          gallery[]{
            asset -> {
              url,
              altText,
              metadata {
                lqip,
                dimensions {
                  width,
                  height,
                }
              }
            }
          },
          attributes[]{
            type,
            name,
            value
          }
        },
      },
      "card": *[_type == 'product' && basis == 'crocheting' && type in ['digital', 'bundle'] && slug.current == $slug][0] {
        ${PRODUCT_CARD_QUERY}
      }
    }
    `,
    params: { slug },
    tags: ['product'],
  });

  !data?.product && notFound();
  return data;
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == "product" && basis == 'crocheting' && type in ["physical", "variable"]] {
        'slug': slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
