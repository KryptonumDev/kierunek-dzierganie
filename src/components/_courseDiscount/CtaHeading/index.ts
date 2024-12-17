import CtaHeading from './CtaHeading';
export default CtaHeading;
export type { CtaHeadingTypes } from './CtaHeading.types';

export const CtaHeading_Query = `
  _type == 'ctaHeading' => {
    heading,
    paragraph,
    ctaText,
    additionalText,
  },
`;
