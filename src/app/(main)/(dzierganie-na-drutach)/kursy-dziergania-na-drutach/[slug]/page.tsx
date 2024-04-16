import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import type { ProductPageQueryProps } from '@/global/types';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Parameters from '@/components/_product/Parameters';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Informations from '@/components/_product/Informations';
import Description, { Description_Query } from '@/components/_product/Description';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import Package, { Package_Query } from '@/components/_product/Package';
import TableOfContent from '@/components/_product/TableOfContent';
import Reviews from '@/components/_product/Reviews';

const LandingPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    product: {
      name,
      // _id,
      // type,
      // variants,
      // price,
      // discount,
      // featuredVideo,
      // countInStock,
      // gallery,
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
            name: 'Dzerganie na drutach',
            path: '/kursy-dziergania-na-drutach',
          },
          {
            name,
            path: `/kursy-dziergania-na-drutach/${slug}`,
          },
        ]}
        visible={true}
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
    </>
  );
};

export default LandingPage;

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return await QueryMetadata('product', `/kursy-dziergania-na-drutach/${slug}`, slug);
}

const query = async (slug: string): Promise<ProductPageQueryProps> => {
  const data = await sanityFetch<ProductPageQueryProps>({
    query: /* groq */ `
    {
      "product": *[(_type == 'course' || _type == 'bundle') && basis == 'knitting' && slug.current == $slug][0] {
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
      "card": *[(_type == 'course' || _type == 'bundle') && basis == 'knitting' && && slug.current == $slug][0] {
        ${PRODUCT_CARD_QUERY}
      }
    }
    `,
    params: { slug },
    tags: ['product'],
  });
  !data && notFound();
  return data;
};

// export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
//   const data: generateStaticParamsProps[] = await sanityFetch({
//     query: /* groq */ `
//       *[(_type == 'course' || _type == 'bundle') && basis == 'knitting'] {
//         'slug': slug.current,
//       }
//     `,
//   });

//   return data.map(({ slug }) => ({
//     slug,
//   }));
// }
