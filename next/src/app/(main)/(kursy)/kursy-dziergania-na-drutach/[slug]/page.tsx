import PrintedManual from '@/components/_dashboard/PrintedManual';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import Description, { Description_Query } from '@/components/_product/Description';
import HeroVirtual from '@/components/_product/HeroVirtual';
import Informations from '@/components/_product/Informations';
import Package, { Package_Query } from '@/components/_product/Package';
import RelatedProducts from '@/components/_product/RelatedProducts';
import RequiredMaterials from '@/components/_product/RequiredMaterials';
import Reviews from '@/components/_product/Reviews';
import TableOfContent from '@/components/_product/TableOfContent';
import { Img_Query } from '@/components/ui/image';
import { MATERIAL_PACKAGE_QUERY, PRODUCT_CARD_QUERY } from '@/global/constants';
import ProductSchema from '@/global/Schema/ProductSchema';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import type { CoursePageQueryProps, generateStaticParamsProps } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { notFound } from 'next/navigation';

const Course = async ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    product: {
      _id,
      _type,
      printed_manual,
      relatedBundle,
      name,
      description,
      chapters,
      reviews,
      courses,
      materialsPackage,
    },
    product,
    card,
    relatedCourses,
  } = await query(slug);

  return (
    <>
      <ProductSchema
        name={name}
        image={product.gallery?.[0] ?? undefined}
        price={product.price}
        reviews={product.reviews}
      />
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

      <Informations tabs={['Opis', 'Potrzebne materiały', 'Spis treści', 'Opinie']}>
        {description?.length > 0 && <Description data={description} />}
        {materialsPackage && <RequiredMaterials materialsPackage={materialsPackage} />}
        {chapters && <TableOfContent chapters={chapters} />}
        <Reviews
          alreadyBought={false}
          reviews={reviews}
          course={true}
          product={{
            id: _id,
            type: _type,
          }}
        />
      </Informations>
      {relatedBundle && relatedBundle.visible && (
        <Package
          product={relatedBundle}
          heading={'Jeden pakiet – niezliczona ilość wiedzy'}
          paragraph={
            'Zdobądź niezbędne umiejętności i rozwijaj kreatywność z **pakietem kursów** – w korzystnej cenie!'
          }
          courses={relatedBundle.courses}
        />
      )}
      {courses && (
        <Package
          product={card}
          heading={'Jeden pakiet – niezliczona ilość wiedzy'}
          paragraph={
            'Zdobądź niezbędne umiejętności i rozwijaj kreatywność z **pakietem kursów** – w korzystnej cenie!'
          }
          courses={courses}
        />
      )}
      {printed_manual && <PrintedManual data={printed_manual} />}
      <RelatedProducts
        relatedCourses={relatedCourses}
        title={'Pozwól sobie na <strong>chwilę relaksu!</strong>'}
        text={'Rozwijaj swoją wyobraźnię z innymi kursami dziergania na drutach'}
      />
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
        "videoProvider": select(
          videoProvider == "youtube" => "youtube",
          videoProvider == "bunnyNet" => "bunnyNet",
          "vimeo"
        ),
        countInStock,
        gallery[]{
          ${Img_Query}
        },
        ${Package_Query}
        ${Description_Query}
        chapters[] {
          chapterName,
          lessons[] -> {
            title,
            lengthInMinutes
          }
        },
        previewLessons[0] -> {
          "slug": slug.current,
        },
        printed_manual->{
          ${PRODUCT_CARD_QUERY}
        },
        ${MATERIAL_PACKAGE_QUERY}
        "reviews": *[_type == 'productReviewCollection' && visible == true && references(^._id)][0...10]{
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
      },
      "relatedCourses": *[_type == "course" && basis == 'knitting' && visible == true && !(slug.current == $slug)][0...3] {
        ${PRODUCT_CARD_QUERY}
      }
    }
    `,
    params: {
      slug,
    },
    tags: ['course', 'bundle', 'productReviewCollection'],
  });
  !data?.product && notFound();
  return data;
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[(_type == 'course' || _type == 'bundle') && basis == 'knitting'] {
        'slug': slug.current,
      }
    `,
    tags: ['course', 'bundle'],
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
