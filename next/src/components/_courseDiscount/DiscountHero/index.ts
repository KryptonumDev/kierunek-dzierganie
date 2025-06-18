import { Img_Query } from '@/components/ui/image';
import DiscountHero from './DiscountHero';
export default DiscountHero;
export type { DiscountHeroTypes } from './DiscountHero.types';

export const DiscountHero_Query = `
  _type == 'discountHero' => {
    image{
      ${Img_Query}
    },
    heading,
    paragraph,
  },
`;
