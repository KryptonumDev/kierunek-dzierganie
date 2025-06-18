import { ProductCard } from '@/global/types';

export type RelatedMaterialsTypes = {
  _type: 'dedicatedPackage';
  heading: string;
  paragraph: string;
  materialRef: ProductCard;
};
