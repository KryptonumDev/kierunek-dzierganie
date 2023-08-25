import { Fetch } from "@/utils/fetch-query";

const domain = 'https://kierunekdzierganie.pl';
const locale = "pl_PL";

const Seo = async ({ title, description, url, children }) => {
  const { data: { global } } = await getData();

  const seo = {
    title: title || 'Kierunek Dzierganie',
    description: description || '',
    url: url || '',
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
    robots: {
      index: false,
    }
  }

  return metadata;


  // return (
  //   <Head>
  //     {/* <Organization /> */}
  //     <title>{seo.title}</title>
  //     <meta property="og:title" content={seo.title} />
  //     <meta name="description" content={seo.description} />
  //     <meta property="og:description" content={seo.description} />
  //     <meta property="og:locale" content={locale} />
  //     <meta property="og:type" content="website" />

  //     <meta property="og:image" content={seo.ogImage} />
  //     <meta name="twitter:card" content="summary_large_image" />
  //     <meta name="twitter:title" content={seo.title} />
  //     <meta name="twitter:description" content={seo.description} />
  //     <meta property="twitter:domain" content={`${domain}/pl`} />
  //     <meta property="twitter:image" content={seo.ogImage} />
  //     <meta property="og:image:width" content="1200" />
  //     <meta property="og:image:height" content="630" />

  //     <meta property="twitter:url" content={`${domain}${seo.url}`} />
  //     <link rel="canonical" href={`${domain}${seo.url}`} />
  //     <meta property="og:url" content={`${domain}${seo.url}`} />
  //     {children}
  //   </Head>
  // )
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