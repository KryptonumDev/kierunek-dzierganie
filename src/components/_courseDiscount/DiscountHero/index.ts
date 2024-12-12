import DiscountHero from './DiscountHero';
export default DiscountHero;
export type { DiscountHeroTypes } from './DiscountHero.types';

export const DiscountHero_Query = `
  discountHero -> {
  image,
  heading,
  paragraph,
  ctaText,
  additionalText,
}
`;
