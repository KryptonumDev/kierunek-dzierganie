import { type ProductCard } from '@/global/types';

export type ItemsType = {
  materials_link?: ProductCard;
  printed_manual?: ProductCard;
  setShowCart: (variable: boolean) => void;
  setPopupState: (variable: boolean) => void;
};
