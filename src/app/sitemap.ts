import sanityFetch from '@/utils/sanityFetch';
import { domain } from '../global/Seo';

const currentDate = new Date();
type FetchProps = {
  landings: {
    slug: string;
  }[];
}

export default async function sitemap() {
  const { landings } = await query();
  const sitemap = landings.map(route => ({
    url: `${domain}/landing/${route}`,
    lastModified: currentDate,
  }));
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