import { Img_Query } from '@/components/ui/image';

/**
 * Global declaration of themeColor in HEX format.
 * @constant
 */
export const THEME_COLOR: string = '#FAF4F0';

/**
 * Global declaration of backgroundColor in HEX format.
 * @constant
 */
export const BACKGROUND_COLOR: string = '#FDFBF8';

/**
 * Global declaration of page language.
 * @constant
 */
export const LOCALE: string = 'pl';

/**
 * Global declaration of domain name of the website. Be aware of the protocol and www or non-www prefix.
 * @constant
 */
export const DOMAIN: string = 'https://kierunekdzierganie.pl';

/**
 * Global declaration of default title.
 * @constant
 */
export const DEFAULT_TITLE: string = 'Kierunek Dzierganie';

/**
 * Global declaration of REGEX.
 * @constant
 */
export const REGEX: { email: RegExp; phone: RegExp; string: RegExp; zip: RegExp } = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^(?:\+(?:\d{1,3}))?(?:[ -]?\(?\d{1,4}\)?[ -]?\d{1,5}[ -]?\d{1,5}[ -]?\d{1,6})$/,
  string: /^(?!\s+$)(.*?)\s*$/,
  zip: /^\d{2}-\d{3}$/,
};

/**
 * Global declaration of easing.
 * @constant
 */
export const EASING = [0.46, 0.03, 0.52, 0.96];

/**
 * Global declaration of mailer lite groups IDs.
 * @constant
 */
export const mailerLiteGroup: { newsletter: string } = {
  newsletter: '112582388',
};

/**
 * Global declaration of page URLs.
 * @constant
 */
export const pageUrls: { knitting: string; crocheting: string } = {
  knitting: '/kursy-dziergania-na-drutach',
  crocheting: '/kursy-szydelkowania',
};

export const productUrls: {
  knitting: string;
  crocheting: string;
  other: string;
  instruction: string;
  materials: string;
} = {
  knitting: '/produkty/dzierganie',
  crocheting: '/produkty/szydelkowanie',
  other: '/produkty/inne',
  instruction: '/produkty/instrukcje',
  materials: '/produkty/pakiety-materialow',
};

/**
 * Declaration of how many posts per page should be visible.
 * @constant
 */
export const POSTS_PER_PAGE = 12;

/**
 * Declaration of enum course badge styles.
 * @constant
 */
export const courseComplexityEnum = {
  'dla-poczatkujacych': {
    name: 'Dla początkujących',
    background: 'var(--primary-300)',
    color: 'var(--primary-800)',
  },
  'dla-srednio-zaawansowanych': {
    name: 'Dla średnio zaawansowanych',
    background: 'var(--primary-400)',
    color: 'var(--primary-800)',
  },
  'dla-zaawansowanych': {
    name: 'Dla zaawansowanych',
    background: 'var(--primary-700)',
    color: 'var(--primary-100)',
  },
};

/**
 * Declaration of enum order statuses.
 * @constant
 */
export const statusesSwitch = {
  'AWAITING PAYMENT': 'Oczekuje na płatność',
  PENDING: 'W trakcie realizacji',
  COMPLETED: 'Zrealizowane',
  REFUNDED: 'Zwrócone',
  CANCELLED: 'Anulowane',
  'AWAITING SEND': 'Oczekuje na wysyłkę',
  'PARCEL GENERATED': 'Przesyłka wygenerowana',
  SENDED: 'Wysłano',
};

export const PRODUCT_CARD_QUERY = `
  _id,
  price,
  discount,
  name,
  excerpt,
  'slug': slug.current,
  visible,
  basis,
  _type,
  "reviewsCount": count(*[_type == 'productReviewCollection' && references(^._id)]),
  "rating": math::avg(*[_type == 'productReviewCollection' && references(^._id)]{rating}.rating),
  gallery[0]{
    ${Img_Query}
  },
  countInStock,
  materials_link -> {
    _type,
    _id,
    name,
    gallery[0] {
      ${Img_Query}
    },
    price,
    rating,
    "reviewsCount": count(*[_type == 'productReviewCollection' && references(^._id)]),
    countInStock,
    basis,
    "slug": slug.current,
    variants[] {
      "_id": _key,
      name,
      price,
      discount,
      countInStock,
      gallery[0]{
        ${Img_Query}
      },
    },
  },
  previewGroupMailerLite,
  automatizationId,
  printed_manual -> {
    _type,
    _id,
    name,
    "slug": slug.current,
    gallery[0] {
      ${Img_Query}
    },
    price,
    rating,
    "reviewsCount": count(*[_type == 'productReviewCollection' && references(^._id)]),
    countInStock,
    basis,
    variants[] {
      "_id": _key,
      name,
      price,
      countInStock,
      gallery[0]{
        ${Img_Query}
      },
    },
  },
  popup,
  complexity,
  variants[]{
    "_id": _key,
    name,
    price,
    countInStock,
    gallery[0]{
      ${Img_Query}
    }
  },
  courses[]->{
    _id,
    automatizationId,
  },
`;

export const MATERIAL_PACKAGE_QUERY = `materialsPackage[] {
          _type,
          heading,
          listParagraph,
          paragraph,
          imageList[]{
            ${Img_Query}
          },
          salesList,
          additionalMaterialsList[]->{
            ${PRODUCT_CARD_QUERY}
          },
          materialRef->{
           ${PRODUCT_CARD_QUERY}
          },
          materialsHeading->{
            _type,
            heading,
            paragraph
          },
          materialsGroupsList[] {
            title,
            additionalInfo,
            materialsList[] {
              name,
              additionalInfo,
              materialRef->{
                _id,
                "slug": slug.current,
                basis,
              }
            }
          },
        },`;
