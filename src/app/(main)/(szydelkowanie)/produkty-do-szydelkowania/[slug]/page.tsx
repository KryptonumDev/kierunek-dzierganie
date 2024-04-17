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
      reviews,
      rating,
    },
  } = await query(slug);

  return (
    <>
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
        {reviews?.length > 0 && <Reviews reviews={reviews} />}
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
      
      "product": *[_type == "product" && slug.current == $slug && basis == 'crocheting'][0] {
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
          ${Img_Query}
        },
        ${Description_Query}
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
            ${Img_Query}
          },
          attributes[]{
            type,
            name,
            value
          }
        },
        "reviews": *[_type == 'productReviewCollection' && references(^._id)][0...10]{
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
  return data;
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
