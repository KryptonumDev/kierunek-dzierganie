import { DOMAIN } from '@/global/constants';
import sanityFetch from '@/utils/sanity.fetch';
import type { MetadataRoute } from 'next';

type FetchTypes = {
  [key: string]: {
    slug: string;
    displayPage?: boolean;
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
  '/polityka-prywatnosci',
  '/regulamin',
  '/produkty/szydelkowanie',
  '/produkty/dzierganie',
  '/produkty/inne',
  '/produkty/instrukcje',
  '/produkty/pakiety-materialow',
  '/program-partnerski',
  '/wspolpraca',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {
    landings = [],
    BlogPost_Collection = [],
    BlogCategory_Collection = [],
    CustomerCaseStudy_Collection = [],
    CrochetingCourses_Collection = [],
    KnittingCourses_Collection = [],
    CrochetingProducts_Collection = [],
    OtherProducts_Collection = [],
    InstructionProducts_Collection = [],
    MaterialsProducts_Collection = [],
    KnittingProducts_Collection = [],
    PartnersPage = [],
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
    ...CrochetingCourses_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/kursy-szydelkowania/${slug}`,
      lastModified: new Date(),
    })),
    ...KnittingCourses_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/kursy-dziergania-na-drutach/${slug}`,
      lastModified: new Date(),
    })),
    ...CrochetingProducts_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/produkty/szydelkowanie/${slug}`,
      lastModified: new Date(),
    })),
    ...KnittingProducts_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/produkty/dzierganie/${slug}`,
      lastModified: new Date(),
    })),
    ...OtherProducts_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/produkty/inne/${slug}`,
      lastModified: new Date(),
    })),
    ...InstructionProducts_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/produkty/instrukcje/${slug}`,
      lastModified: new Date(),
    })),
    ...MaterialsProducts_Collection.map(({ slug }) => ({
      url: `${DOMAIN}/produkty/pakiety-materialow/${slug}`,
      lastModified: new Date(),
    })),
    ...PartnersPage.filter(({ displayPage }) => displayPage).map(() => ({
      url: `${DOMAIN}/partnerzy`,
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
        'CrochetingCourses_Collection': *[(_type == 'course' || _type == 'bundle') && basis =='crocheting' && visible == true][] {
          'slug': slug.current
        },
        'KnittingCourses_Collection': *[(_type == 'course' || _type == 'bundle') && basis =='knitting' && visible == true][] {
          'slug': slug.current
        },
        'CrochetingProducts_Collection': *[(_type=='product'|| _type=='voucher') && basis =='crocheting' && visible == true][] {
          'slug': slug.current
        },
        'KnittingProducts_Collection': *[(_type=='product'|| _type=='voucher') && basis =='knitting' && visible == true][] {
          'slug': slug.current
        },
        'OtherProducts_Collection': *[(_type=='product'|| _type=='voucher') && basis =='other' && visible == true][] {
          'slug': slug.current
        },
        'InstructionProducts_Collection': *[(_type=='product'|| _type=='voucher') && basis =='instruction' && visible == true][] {
          'slug': slug.current
        },
        'MaterialsProducts_Collection': *[(_type=='product'|| _type=='voucher') && basis =='materials' && visible == true][] {
          'slug': slug.current
        },
        'PartnersPage': *[_id=="Partners_Page"][] {
          displayPage,
        }
      }
    `,
  });
};
