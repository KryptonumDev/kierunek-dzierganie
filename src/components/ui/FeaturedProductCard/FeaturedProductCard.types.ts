import type { ProductCard } from '@/global/types';

export type Props = {
  data: ProductCard;
  inCart?: boolean;
  excerpt?: JSX.Element;
  basis?: string;
  badge?: string;
};
