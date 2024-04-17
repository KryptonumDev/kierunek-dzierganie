import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import type { CoursePageQueryProps, generateStaticParamsProps } from '@/global/types';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Informations from '@/components/_product/Informations';
import Description, { Description_Query } from '@/components/_product/Description';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import Package, { Package_Query } from '@/components/_product/Package';
import TableOfContent from '@/components/_product/TableOfContent';
import Reviews from '@/components/_product/Reviews';
import HeroVirtual from '@/components/_product/HeroVirtual';
import { Img_Query } from '@/components/ui/image';
import RelatedProducts from '@/components/_product/RelatedProducts';
import { Suspense } from 'react';

const Course = async ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    product: { relatedBundle, name, description, chapters, reviews, courses, basis, _id },
    product,
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
      <HeroVirtual course={product} />
      {relatedBundle && (
        <Package
          product={relatedBundle}
          heading={'Jeden pakiet – niezliczona ilość wiedzy'}
          paragraph={
            'Zdobądź niezbędne umiejętności i rozwijaj kreatywność z **pakietem kursów** – w korzystnej cenie!'
          }
          courses={relatedBundle.courses}
        />
      )}
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
      <Informations tabs={['Spis treści', 'Opis', 'Parametry', 'Opinie']}>
        {chapters && <TableOfContent chapters={chapters} />}
        {description?.length > 0 && <Description data={description} />}
        {reviews.length > 0 && <Reviews reviews={reviews} />}
      </Informations>
      <Suspense>
        <RelatedProducts
          basis={basis}
          title={'Pozwól sobie na <strong>chwilę relaksu!</strong>'}
          text={'Rozwijaj swoją wyobraźnię z innymi kursami szydełkowania'}
          _id={_id}
        />
      </Suspense>
    </>
  );
};

export default Course;

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return await QueryMetadata(['course', 'bundle'], `/kursy-dziergania-na-drutach/${slug}`, slug);
}

const query = async (slug: string): Promise<CoursePageQueryProps> => {
  const data = await sanityFetch<CoursePageQueryProps>({
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
        chapters[] {
          chapterName,
          lessons[] -> {
            title,
            lengthInMinutes,
          },
        },
        "reviews": *[_type == 'productReviewCollection' && references(^._id)][0...10]{
          rating,
          review,
          nameOfReviewer,
          _id
        },
        "rating": math::avg(*[_type == 'productReviewCollection' && references(^._id)]{rating}.rating),
        author->{
          _id,
          name,
          "slug": slug.current,
          image {
            ${Img_Query}
          },
          description,
          "countOfCourse": count(*[_type == 'course' && references(^._id)]),
        },
        "relatedBundle": *[_type == 'bundle' && references(^._id)][0]{
          ${PRODUCT_CARD_QUERY}
          courses[]->{
            ${PRODUCT_CARD_QUERY}
          }
        },
      },
      "card": *[_type == 'bundle' && basis == 'knitting' && slug.current == $slug][0] {
        ${PRODUCT_CARD_QUERY}
      }
    }
    `,
    params: { slug },
    tags: ['course', 'bundle'],
  });
  !data && notFound();
  return data;
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[(_type == 'course' || _type == 'bundle') && basis == 'knitting'] {
        'slug': slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
