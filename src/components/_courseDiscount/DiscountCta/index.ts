import { Img_Query } from '@/components/ui/image';
import DiscountCta from './DiscountCta';
export default DiscountCta;
export type { DiscountCtaTypes } from './DiscountCta.types';

export const DiscountCta_Query = `
  _type == 'discountCta' => {
    image{
      ${Img_Query}
    } ,
    heading,
    paragraph,
    additionalParagraph,
    ctaText,
    additionalText,
    showDiscount,
  },  
`;
