export const PRODUCT = `
  _id,
  price,
  discount,
  name,
  'slug': slug.current,
  basis,
  type,
  _type,
  course -> {
    complexity,
  },
  gallery[0]{
    asset -> {
      url,
      altText,
      metadata {
        lqip,
        dimensions {
          width,
          height,
        }
      }
    }
  },
  variants{
    _key,
    name,
    price,
    discount,
    gallery[0]{
      asset -> {
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height,
          }
        }
      }
    }
  }
`;
