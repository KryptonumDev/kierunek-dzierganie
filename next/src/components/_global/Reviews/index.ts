import Reviews from './Reviews';
export type { Props as ReviewsProps } from './Reviews.types';
export default Reviews;

export const Reviews_Query = `
  _type == "Reviews" => {
    heading,
    list[] -> {
      rating,
      name,
      review,
      images[]{
        asset -> {
          url,
          altText,
          metadata {
            lqip,
            dimensions {
              width,
              height,
            },
          },
        },
      },
    },
  },
`;