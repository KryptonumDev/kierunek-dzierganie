import CtaSection from './CtaSection';
export type { Props as CtaSectionProps } from './CtaSection.types';
export default CtaSection;

export const CtaSection_Query = `
  _type == 'CtaSection' => {
    isReversed,
    isHighlighted,
    heading,
    paragraph,
    cta {
      text,
      href,
    },
    cta_Annotation,
    img {
      asset -> {
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height,
          }
        }
      }
    }
  },
`;