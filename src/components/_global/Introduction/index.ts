import Introduction from './Introduction';
export type { Props as IntroductionProps } from './Introduction.types';
export default Introduction;

export const Introduction_Query = `
  _type == "Introduction" => {
    _type,
    isReversed,
    heading,
    paragraph,
    cta {
      text,
      href,
    },
    img {
      asset -> {
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height,
          },
        },
      },
    },
  },
`;