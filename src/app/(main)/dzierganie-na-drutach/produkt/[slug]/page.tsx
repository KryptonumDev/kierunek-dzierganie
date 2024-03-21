import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import type { ProductPageQueryProps, generateStaticParamsProps } from '@/global/types';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroPhysical from '@/components/_product/HeroPhysical';
import Parameters from '@/components/_product/Parameters';
import Description from '@/components/_product/Description';
import Flex from '@/components/_product/Flex';
import { QueryMetadata } from '@/global/Seo/query-metadata';

const LandingPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { name, _id, type, variants, price, discount, featuredVideo, countInStock, gallery, parameters } =
    await query(slug);
  return (
    <>
      <Breadcrumbs
        data={[
          {
            name: 'Dzerganie na drutach',
            path: '/dzierganie-na-drutach/',
          },
          {
            name,
            path: `/dzierganie-na-drutach/produkt/${slug}`,
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
      {/* TODO: Check is there parameters and description sections, if no disable tabs system and show only needed */}
      <Description>
        {/* TODO: Add product description */}
        <Flex />
        <Parameters parameters={parameters} />
      </Description>
    </>
  );
};

export default LandingPage;

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return await QueryMetadata('product', `/dzierganie-na-drutach/produkt/${slug}`, slug);
}

const query = async (slug: string): Promise<ProductPageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "product" && slug.current == $slug && basis == 'knitting' && type in ["physical", "variable"]][0] {
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
      }
    `,
    params: { slug },
    tags: ['product'],
  });
  !data && notFound();
  return data as ProductPageQueryProps;
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == "product" && basis == 'knitting' && type in ["physical", "variable"]] {
        'slug': slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
