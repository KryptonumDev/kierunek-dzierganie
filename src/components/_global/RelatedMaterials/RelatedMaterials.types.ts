import type { ProductCard } from '@/global/types';

export type RelatedMaterialsTypes = {
  data: ProductCard;
  close?: string;
  closedMaterials: boolean;
};
