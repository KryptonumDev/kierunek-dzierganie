import type { ProductPhysical, ProductVariant } from '@/global/types';

export type Props = {
  id: string;
  disabled: boolean;
  variant?: ProductVariant | ProductPhysical;
  quantity?: number;
};
