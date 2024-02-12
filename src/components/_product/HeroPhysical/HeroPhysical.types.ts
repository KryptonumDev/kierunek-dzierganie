import type { ProductPhysical, ProductVariant } from '@/global/types';

export type Props = {
  name: string;
  id: string;
  type: string;
  variants: Array<ProductVariant>;
  physical: ProductPhysical;
};

export type AttributesTypes = Array<{
  type: string;
  name: string;
  value: Array<string>;
}>;

export type SelectedAttributesTypes = {
  [key: string]: string | undefined;
};
