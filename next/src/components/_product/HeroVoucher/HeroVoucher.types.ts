import type { ProductPhysical } from '@/global/types';

export type Props = {
  data: ProductPhysical;
};

export type AttributesTypes = Array<{
  type: string;
  name: string;
  value: Array<string>;
}>;

export type SelectedAttributesTypes = {
  [key: string]: string | undefined;
};
