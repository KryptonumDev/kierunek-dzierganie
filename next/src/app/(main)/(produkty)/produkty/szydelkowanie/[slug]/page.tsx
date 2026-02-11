import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroPhysical from '@/components/_product/HeroPhysical';
import Parameters from '@/components/_product/Parameters';
import Informations from '@/components/_product/Informations';
import Description, { Description_Query } from '@/components/_product/Description';
import type { ProductPageQueryProps, generateStaticParamsProps } from '@/global/types';
import { Img_Query } from '@/components/ui/image';
import Reviews from '@/components/_product/Reviews';
import ProductSchema from '@/global/Schema/ProductSchema';
import HeroVoucher from '@/components/_product/HeroVoucher/HeroVoucher';

const Product = async ({ params: { slug } }: { params: { slug: string } }) => {
  const {
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
      relatedCourses,
    },
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
            name: 'Produkty',
            path: '/produkty',
          },
          {
            name: 'Szydełkowanie',
            path: '/produkty/szydelkowanie',
          },
          {
            name,
            path: `/produkty/szydelkowanie/${slug}`,
          },
        ]}
        visible={true}
      />
      {_type === 'voucher' ? (
        <HeroVoucher
          data={{
            basis: 'crocheting',
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
      ) : (
        <HeroPhysical
          name={name}
          id={_id}
          type={type}
          variants={variants}
          relatedCourses={relatedCourses}
          physical={{
            basis: 'crocheting',
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
      )}
      <Informations tabs={['Opis', 'Parametry', 'Opinie']}>
        {description?.length > 0 && <Description data={description} />}
        {parameters?.length > 0 && <Parameters parameters={parameters} />}
        <Reviews
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
  return await QueryMetadata(['product', 'voucher'], `/produkty/szydelkowanie/${slug}`, slug);
}

const query = async (slug: string): Promise<ProductPageQueryProps> => {
  const data = await sanityFetch<ProductPageQueryProps>({
    query: /* groq */ `
      {
        "product": *[((_type == "product" && basis == 'crocheting') || _type=='voucher') && slug.current == $slug][0] {
          name,
          visible,
          'slug': slug.current,
          _id,
          _type,
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
            "videoProvider": select(
              videoProvider == "youtube" => "youtube",
              videoProvider == "bunnyNet" => "bunnyNet",
              "vimeo"
            ),
            gallery[]{
              ${Img_Query}
            },
            attributes[]{
              type,
              name,
              value
            }
          },
          "relatedCourses": *[_type == 'course' && (materials_link._ref == ^._id || ^._id in related_products[]._ref)][]{
            _id,
            name
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
    tags: ['product', 'course', 'voucher', 'productReviewCollection'],
  });
  // If product is not found for the given slug within this category, render 404
  if (!data?.product) notFound();

  return data;
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[(_type == "product" || _type=='voucher') && basis == 'crocheting'] {
        'slug': slug.current,
      }
    `,
    tags: ['product', 'voucher'],
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
