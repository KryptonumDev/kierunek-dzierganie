import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroPhysical from '@/components/_product/HeroPhysical';
import Parameters from '@/components/_product/Parameters';
import Informations from '@/components/_product/Informations';
import Description, { Description_Query } from '@/components/_product/Description';
import type { ProductPageQuery, ProductPageQueryProps, generateStaticParamsProps } from '@/global/types';
import { Img_Query } from '@/components/ui/image';
import Reviews from '@/components/_product/Reviews';
import { createClient } from '@/utils/supabase-server';
import ProductSchema from '@/global/Schema/ProductSchema';

const Product = async ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    data: {
      product: {
        name,
        _id,
        _type,
        type,
        variants,
        price,
        discount,
        featuredVideo,
        countInStock,
        gallery,
        parameters,
        description,
        reviews,
        rating,
      },
    },
    user,
  } = await query(slug);

  return (
    <>
      <ProductSchema
        name={name}
        image={gallery?.[0] ?? undefined}
        price={price}
        reviews={reviews}
      />
      <Breadcrumbs
        data={[
          {
            name: 'Produkty do szydełkowania',
            path: '/produkty-do-szydelkowania',
          },
          {
            name,
            path: `/produkty-do-szydelkowania/${slug}`,
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
          _id,
          name,
          price: price!,
          discount,
          countInStock: countInStock!,
          featuredVideo,
          gallery: gallery!,
          rating,
          reviewsCount: reviews.length,
        }}
      />
      <Informations tabs={['Opis', 'Parametry', 'Opinie']}>
        {description?.length > 0 && <Description data={description} />}
        {parameters?.length > 0 && <Parameters parameters={parameters} />}
        <Reviews
          user={user}
          alreadyBought={true}
          reviews={reviews}
          course={false}
          product={{
            id: _id,
            type: _type,
          }}
        />
      </Informations>
    </>
  );
};

export default Product;

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return await QueryMetadata('product', `/kursy-szydelkowania/${slug}`, slug);
}

const query = async (slug: string): Promise<ProductPageQuery> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res = await supabase
    .from('profiles')
    .select(
      `
        id,
        billing_data->firstName,
        courses_progress (
          course_id
        )
      `
    )
    .eq('id', user?.id)
    .single();

  const data = await sanityFetch<ProductPageQueryProps>({
    query: /* groq */ `
    {
      
      "product": *[_type == "product" && slug.current == $slug && basis == 'crocheting'][0] {
        name,
        'slug': slug.current,
        visible,
        _id,
        basis,
        type,
        price,
        discount,
        featuredVideo,
        countInStock,
        gallery[]{
          ${Img_Query}
        },
        ${Description_Query}
        parameters[]{
          name,
          value
        },
        variants[]{
          "_id": _key,
          name,
          price,
          discount,
          countInStock,
          featuredVideo,
          gallery[]{
            ${Img_Query}
          },
          attributes[]{
            type,
            name,
            value
          }
        },
        "relatedCourses": *[_type == 'course' && references(^._id)][]{
          _id
        },
        "reviews": *[_type == 'productReviewCollection' && visible == true && references(^._id)][0...10]{
          rating,
          review,
          nameOfReviewer,
          _id
        },
        "rating": math::avg(*[_type == 'productReviewCollection' && references(^._id)]{rating}.rating),
      }
    }
    `,
    params: { slug },
    tags: ['product'],
  });
  !data && notFound();

  if (!data.product.visible) {
    // for hidden products check is user already bought related course
    let owned = false;

    res.data?.courses_progress.forEach((course: { course_id: string }) => {
      if (
        data!.product!.relatedCourses?.some((relatedCourse: { _id: string }) => relatedCourse._id === course.course_id)
      ) {
        owned = true;
      }
    });

    if (!owned) return notFound();
  }

  return { data: data, user: res.data?.firstName as string };
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == "product" && basis == 'crocheting'] {
        'slug': slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
