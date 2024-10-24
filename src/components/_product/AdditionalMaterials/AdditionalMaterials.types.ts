import { ProductCard } from '@/global/types';

export type AdditionalMaterialsTypes = {
  _type: 'additionalMaterials';
  heading: string;
  additionalMaterialsList: ProductCard[];
};
