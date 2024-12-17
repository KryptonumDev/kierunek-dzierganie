import { DiscountHeroTypes } from './DiscountHero.types';

export default function DiscountHero({ index }: DiscountHeroTypes) {
  return index > 10 ? '1' : null;
}
