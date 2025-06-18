import SimpleCtaSection from './SimpleCtaSection';
export type { Props as SimpleCtaSectionProps } from './SimpleCtaSection.types';
export default SimpleCtaSection;

export const SimpleCtaSection_Query = `
  _type == 'SimpleCtaSection' => {
    heading,
    paragraph,
    cta {
      text,
      href,
    },
    cta_Annotation,
  },
`;