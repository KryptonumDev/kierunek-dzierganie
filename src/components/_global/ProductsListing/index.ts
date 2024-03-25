import ProductsListing from './ProductsListing';
export default ProductsListing;
export type { ProductsListingTypes } from './ProductsListing.types';

export const ProductsListing_Query = `
  _id,
  price,
  discount,
  name,
  'slug': slug.current,
  basis,
  type,
  _type,
  course->{
    complexity
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
  variants[]{
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
