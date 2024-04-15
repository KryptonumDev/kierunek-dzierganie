import { type SearchResultType } from '@/components/_global/Header/Header.types';
import { Img_Query } from '@/components/ui/image';
import sanityFetch from '@/utils/sanity.fetch';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase().replace(/\s/g, '-');
  try {
    const data = await getSearchResults(search);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

async function getSearchResults(search: string | undefined) {
  return await sanityFetch<SearchResultType>({
    query: /* groq */ `
    {
    "courses": *[_type=='product' && type=='digital' && slug.current match ["*"+$slug+"*"]][]{
      course -> {
        image {
          ${Img_Query}
        }
      },
      name,
      basis,
      "slug": slug.current,
    },
      "physicalProducts": *[_type=='product' && type=='physical' && slug.current match ["*"+$slug+"*"]][] {
        gallery[0] {
          ${Img_Query}
        },
        name,
        basis,
        "slug": slug.current,
      },
      "productVariants": *[_type=='product' && type=='variable' && slug.current match["*"+$slug+"*"]][] {
          variants[0] {
            gallery[0] {
              ${Img_Query}
            }
          },
          "slug": slug.current,
          name,
          basis,
      },
      "blogPosts": *[_type=='BlogPost_Collection' && slug.current match ["*"+$slug+"*"]][] {
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
    params: {
      slug: search,
    },
  });
}
