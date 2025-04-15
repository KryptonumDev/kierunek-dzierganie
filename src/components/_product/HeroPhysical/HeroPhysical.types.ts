import type { ImgType } from '@/global/types';
import type { VideoProvider } from '@/components/ui/VideoPlayer/VideoPlayer.types';

export type ProductVariant = {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  countInStock: number;
  featuredVideo?: string;
  videoProvider?: VideoProvider;
  gallery: ImgType[];
  attributes?: {
    type: string;
    name: string;
    value: string;
  }[];
};

export type ProductPhysical = {
  basis: string;
  _id: string;
  name: string;
  price: number;
  discount?: number;
  countInStock: number;
  featuredVideo?: string;
  videoProvider?: VideoProvider;
  gallery: ImgType[];
  rating?: number;
  reviewsCount: number;
};

export type Props = {
  name: string;
  id: string;
  type?: string;
  variants?: ProductVariant[];
  physical: ProductPhysical;
};

export type AttributesTypes = Array<{
  type: string;
  name: string;
  value: string[];
}>;

export type SelectedAttributesTypes = {
  [key: string]: string;
};
