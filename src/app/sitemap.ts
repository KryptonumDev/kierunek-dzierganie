import sanityFetch from '@/utils/sanity.fetch';
import { DOMAIN } from '@/global/constants';
import type { MetadataRoute } from 'next';

type FetchTypes = {
  landings: {
    slug: string;
  }[];
};


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { landings } = await query();
  const sitemap = [
    ...landings.map(({ slug }) => ({
      url: `${DOMAIN}/landing/${slug}`,
      lastModified: new Date(),
    })),
  ];

  return sitemap;
}

const query = async (): Promise<FetchTypes> => {
  return await sanityFetch({
    query: /* groq */ `
      {
        'landings': *[_type == 'landingPage'] {
          'slug': slug.current
        }
      }
    `,
  });
};
