import type { ProductCard, CourseCard } from '@/global/types';

export type Props = {
  data: ProductCard | CourseCard;
  inCart?: boolean;
  horizontal?: boolean;
};
