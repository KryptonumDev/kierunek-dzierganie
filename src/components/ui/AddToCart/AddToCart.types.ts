import type { ProductPhysical, ProductVariant } from '@/global/types';

export type Props = {
  id: string;
  type: string;
  disabled: boolean;
  variant?: ProductVariant | ProductPhysical;
};
