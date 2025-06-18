import { type ImgType } from '@/global/types';

export type ItemType = {
  _id: string;
  gallery?: ImgType;
  basis: 'knitting' | 'crocheting';
  slug: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  countInStock: number;
  variants: Array<{
    _id: string;
    name: string;
    price: number;
    discount: number;
    countInStock: number;
    featuredVideo: string;
    gallery: ImgType;
  }> | null;
  setShowCart: (variable: boolean) => void;
  setPopupState: (variable: boolean) => void;
};
