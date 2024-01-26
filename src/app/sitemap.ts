import sanityFetch from '@/utils/sanityFetch';
import type { MetadataRoute } from 'next';
import { domain } from '@/global/constants';

type FetchProps = {
  landings: {
    slug: string;
  }[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { landings } = await query();
  const sitemap = [
    ...landings.map(route => ({
      url: `${domain}/landing/${route}`,
      lastModified: new Date(),
    })),
  ];

  return sitemap;
}

const query = async (): Promise<FetchProps> => {
  const data = await sanityFetch(/* groq */ `
    {
      'landings': *[_type == 'landingPage'] {
        'slug': slug.current
      }
    }
  `);
  return data as FetchProps;
};