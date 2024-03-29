import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import { QueryMetadata } from '@/global/Seo/query-metadata';
import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroPhysical from '@/components/_product/HeroPhysical';
import Parameters from '@/components/_product/Parameters';
import { ColumnImageSection_Query } from '@/components/_product/ColumnImageSection';
import Informations from '@/components/_product/Informations';
import type { ProductPageQueryProps, generateStaticParamsProps } from '@/global/types';
import Description from '@/components/_product/Description';

const LandingPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { name, _id, type, variants, price, discount, featuredVideo, countInStock, gallery, parameters, description } =
    await query(slug);

  return (
    <>
      <Breadcrumbs
        data={[
          {
            name: 'Szydełkowanie',
            path: '/szydelkowanie/',
          },
          {
            name,
            path: `/szydelkowanie/produkt/${slug}`,
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
      <Informations tabs={['Opis', 'Parametry']}>
        <Description data={description} />
        {parameters?.length > 0 && <Parameters parameters={parameters} />}
      </Informations>
    </>
  );
};

export default LandingPage;

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return await QueryMetadata('product', `/szydelkowanie/produkt/${slug}`, slug);
}

const query = async (slug: string): Promise<ProductPageQueryProps> => {
  const data = await sanityFetch<ProductPageQueryProps>({
    query: /* groq */ `
      *[_type == "product" && slug.current == $slug && basis == 'crocheting' && type in ["physical", "variable"]][0] {
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
        description[] {
          ${ColumnImageSection_Query}
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
      *[_type == "product" && basis == 'crocheting' && type in ["physical", "variable"]] {
        'slug': slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
