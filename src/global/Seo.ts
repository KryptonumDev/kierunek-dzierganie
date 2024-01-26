import sanityFetch from '@/utils/sanityFetch';
import type { Metadata } from 'next';
import { domain, locale } from './constants';

type SeoProps = {
  title: string;
  description: string;
  path: string;
};
type QueryProps = {
  robotsIndex: boolean;
  seo: {
    og_Img: string;
  };
};

const Seo = async ({ title, description, path, ...props }: SeoProps): Promise<Metadata> => {
  const {
    robotsIndex,
    seo: { og_Img },
  }: QueryProps = await query();

  const seo = {
    title: title || 'Kierunek Dziergnie',
    description: description || '',
    url: `${domain}${path}`,
    ogImage: og_Img || '',
  };

  const metadata: Metadata = {
    ...(!robotsIndex && {
      robots: {
        index: false,
      },
    }),
    metadataBase: new URL(domain),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.url,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: seo.title,
      url: seo.url,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: locale,
      type: 'website',
    },
    ...props,
  };

  return metadata;
};

const query = async (): Promise<QueryProps> => {
  const data = await sanityFetch(/* groq */ `
    *[_id == "global"][0] {
      robotsIndex,
      seo {
        'og_Img': og_Img.asset -> url+"?w=1200"
      }
    }
  `);
  return data as QueryProps;
};

export default Seo;