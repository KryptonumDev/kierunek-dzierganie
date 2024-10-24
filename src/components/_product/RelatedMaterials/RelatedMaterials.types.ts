import { ImgType } from '@/global/types';

export type RelatedMaterialsTypes = {
  _type: 'dedicatedPackage';
  heading: string;
  paragraph: string;
  materialRef: {
    slug: string;
    rating: number;
    reviewsCount: number;
    _id: string;
    image: ImgType;
    price: number;
    discount?: number;
    name: string;
    _type: string;
    countInStock: number;
    basis: 'knitting' | 'crocheting';
  };
};
