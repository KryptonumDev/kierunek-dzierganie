import Script from 'next/script';
import { type ImgType } from '../types';

export default async function ProductSchema({
  name,
  image,
  price,
  reviews,
}: {
  name: string;
  price: number | undefined;
  image: ImgType | undefined;
  reviews: {
    rating: number;
    review: string;
    nameOfReviewer: string;
  }[];
}) {
  return (
    <Script
      id='json-ld-product'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          ...(name && { name }),
          ...(image && { image: image.asset.url }),
          ...(price && {
            offers: {
              '@type': 'Offer',
              price,
              priceCurrency: 'PLN',
            },
          }),
          ...(reviews && {
            review: [
              reviews.map(({ rating, review, nameOfReviewer }) => ({
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: nameOfReviewer,
                },
                reviewBody: review,
                name: nameOfReviewer,
                reviewRating: {
                  '@type': 'Rating',
                  bestRating: '5',
                  worstRating: '1',
                  ratingValue: rating,
                },
              })),
            ],
          }),
        }),
      }}
    />
  );
}
