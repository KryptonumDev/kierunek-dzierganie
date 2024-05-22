import sanityFetch from '@/utils/sanity.fetch';
import { DOMAIN } from '@/global/constants';
import type { MetadataRoute } from 'next';

type FetchTypes = {
  [key: string]: {
    slug: string;
  }[];
};

const staticRoutes = [
  '',
  '/blog',
  '/nasze-marki',
  '/kontakt',
  '/kursy-dziergania-na-drutach',
  '/kursy-szydelkowania',
  '/newsletter',
  '/zespol',
  '/partnerzy',
  '/polityka-prywatnosci',
  '/regulamin',
  '/produkty-do-dziergania',
  '/produkty-do-szydelkowania',
  '/program-partnerski',
  '/wspolpraca',
];


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {
    landings = [],
    BlogPost_Collection = [],
    BlogCategory_Collection = [],
    CustomerCaseStudy_Collection = [],
  } = await query();

  return [
    ...staticRoutes.map((route) => ({
      url: `${DOMAIN}${route}`,
      lastModified: new Date(),
    })),
    ...landings.map(({ slug }) => ({
      url: `${DOMAIN}/landing/${slug}`,
      lastModified: new Date(),
    })),
    ...BlogPost_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/blog/${slug}`,
      lastModified: new Date(),
    })),
    ...BlogCategory_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/blog/kategoria/${slug}`,
      lastModified: new Date(),
    })),
    ...CustomerCaseStudy_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/historia-kursantek/${slug}`,
      lastModified: new Date(),
    })),
  ];
}

const query = async (): Promise<FetchTypes> => {
  return await sanityFetch({
    query: /* groq */ `
      {
        'landings': *[_type == 'landingPage'] {
          'slug': slug.current
        },
        'BlogPost_Collection': *[_type == 'BlogPost_Collection'] {
          'slug': slug.current
        },
        'BlogCategory_Collection': *[_type == 'BlogCategory_Collection'] {
          'slug': slug.current
        },
        'CustomerCaseStudy_Collection': *[_type == 'CustomerCaseStudy_Collection'] {
          'slug': slug.current
        },
        // /kursy-dziergania-na-drutach/[slug] query
        // /kursy-szydelkowania/[slug] query
        // /produkty-do-dziergania/[slug] query
        // /produkty-do-szydelkowania/[slug] query
      }
    `,
  });
};
