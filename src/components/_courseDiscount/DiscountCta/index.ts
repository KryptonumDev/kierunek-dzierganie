import DiscountCta from './DiscountCta';
export default DiscountCta;
export type { DiscountCtaTypes } from './DiscountCta.types';

export const DiscountCta_Query = `
  _type == 'discountCta' => {
    image,
    heading,
    paragraph,
    additionalParagraph,
    ctaText,
    additionalText,
  }
`;
