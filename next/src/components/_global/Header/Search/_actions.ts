'use server';

import { type SearchResultType } from '../Header.types';
import { Img_Query } from '@/components/ui/image';
import sanityFetch from '@/utils/sanity.fetch';

export async function searchProducts(search: string | undefined): Promise<SearchResultType | null> {
  if (!search || search.length < 3) return null;

  const slug = search.toLowerCase().replace(/\s/g, '-');

  return await sanityFetch<SearchResultType>({
    query: /* groq */ `
    {
    "courses": *[_type=='course' && name match ["*"+$slug+"*"] && visible==true][]{
      gallery[0] {
          ${Img_Query}
        },
      name,
      basis,
      "slug": slug.current,
    },
      "physicalProducts": *[_type=='product' && type=='physical' && name match ["*"+$slug+"*"] && visible==true][] {
        gallery[0] {
          ${Img_Query}
        },
        name,
        basis,
        "slug": slug.current,
      },
      "variableProducts": *[_type=='product' && type=='variable' && name match["*"+$slug+"*"] && visible==true][] {
          variants[0] {
            gallery[0] {
              ${Img_Query}
            }
          },
          "slug": slug.current,
          name,
          basis,
      },
      "blogPosts": *[_type=='BlogPost_Collection' && hero.heading match ["*"+$slug+"*"]][] {
        hero {
          img {
            ${Img_Query}
          },
          heading,
          },
          "slug": slug.current,
        },
      }
    `,
    params: { slug },
    tags: ['product', 'course', 'bundle', 'voucher', 'BlogPost_Collection'],
  });
}
