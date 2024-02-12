import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import sanityFetch from '@/utils/sanity.fetch';
import { Seo_Query } from '@/global/Seo';
import type { ProductPageQueryProps, generateStaticParamsProps } from '@/global/types';
// import Breadcrumbs from '@/components/_global/Breadcrumbs';
import HeroPhysical from '@/components/_product/HeroPhysical';

const LandingPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { name, _id, type, variants, price, discount, featuredVideo, countInStock, gallery } = await query(slug);

  return (
    <>
      {/* <Breadcrumbs
        data={[
          {
            name,
            path: `/landing/${slug}`,
          },
        ]}
        visible={false}
      /> */}
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
    </>
  );
};

export default LandingPage;

// export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
//   const {
//     seo: { title, description },
//   } = await query(slug);

//   return Seo({
//     title,
//     description,
//     path: `/landing/${slug}`, // TODO: change to proper path
//   });
// }

const query = async (slug: string): Promise<ProductPageQueryProps> => {
  const data = await sanityFetch({
    query: /* groq */ `
      *[_type == "product" && slug.current == $slug][0] {
        name,
        'slug': slug.current,
        _id,

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
        ${Seo_Query}
      }
    `,
    params: { slug },
    isDraftMode: draftMode().isEnabled,
  });
  !data && notFound();
  return data as ProductPageQueryProps;
};

export async function generateStaticParams(): Promise<generateStaticParamsProps[]> {
  const data: generateStaticParamsProps[] = await sanityFetch({
    query: /* groq */ `
      *[_type == "product" && (type == 'variable' || type=='physical')] {
        'slug': slug.current,
      }
    `,
  });

  return data.map(({ slug }) => ({
    slug,
  }));
}
