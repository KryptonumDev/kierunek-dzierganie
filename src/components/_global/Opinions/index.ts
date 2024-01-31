import Opinions from './Opinions';
export type { Props as OpinionsProps } from './Opinions.types';
export default Opinions;

export const Opinions_Query = `
  _type == 'Opinions' => {
    _type,
    heading,
    list[] {
      author,
      description,
      gallery[] {
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
    paragraph,
    cta {
      text,
      href
    },
    cta_Annotation,
  },
`;