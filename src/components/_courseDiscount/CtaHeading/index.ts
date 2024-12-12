import CtaHeading from './CtaHeading';
export default CtaHeading;
export type { CtaHeadingTypes } from './CtaHeading.types';

export const CtaHeading_Query = `
  ctaHeading {
  heading,
  paragraph,
  ctaText,
  additionalText,
}
`;
