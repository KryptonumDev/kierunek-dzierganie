import sanityFetch from '@/utils/sanityFetch';
import { domain } from '../global/Seo';

const currentDate = new Date();
type FetchProps = {
  slug: string;
}

export default async function sitemap() {
  const pages = await query();
  const sitemap = pages.map(route => ({
    url: `${domain}/landing/${route}`,
    lastModified: currentDate,
  }));
  return sitemap;
}

const query = async (): Promise<FetchProps[]> => {
  const data = await sanityFetch(/* groq */ `
    *[_type == 'landingPage'] {
      'slug': slug.current
    }
  `);
  return data as FetchProps[];
};