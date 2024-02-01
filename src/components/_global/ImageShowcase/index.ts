import ImageShowcase from './ImageShowcase';
export type { Props as ImageShowcaseProps } from './ImageShowcase.types';
export default ImageShowcase;

export const ImageShowcase_Query = `
  _type == 'ImageShowcase' => {
    _type,
    isGrid,
    heading,
    paragraph,
    cta {
      text,
      href,
    },
    cta_Annotation,
    'images': img[] {
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