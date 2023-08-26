import { Fetch } from "@/utils/fetch-query";

export const domain = 'https://kierunekdzierganie.pl';
const locale = "pl_PL";

const Seo = async ({ title, description, url }) => {
  const { data: { global } } = await getData();

  const seo = {
    title: title || 'Kierunek Dzierganie',
    description: description || '',
    url: `${domain}${url}` || '',
    ogImage: global.seo.og_Img.asset.url
  }

  const metadata = {
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
    themeColor: '#FDFBF8',
  }

  return metadata;
}

export default Seo;

const getData = async () => {
  const { body: { data } } = await Fetch({
    query: `
      global: Global(id: "global") {
        seo {
          og_Img {
            asset {
              url
            }
          }
        }
      }
    `,
  })
  return { data };
}