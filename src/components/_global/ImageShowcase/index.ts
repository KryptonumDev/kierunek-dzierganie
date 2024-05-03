import { Img_Query } from '@/components/ui/image';
import { CtaQuery } from '@/components/ui/Button';
import ImageShowcase from './ImageShowcase';
export type { Props as ImageShowcaseProps } from './ImageShowcase.types';
export default ImageShowcase;

export const ImageShowcase_Query = (inline = false) => `
 ${inline ? 'ImageShowcase' : '_type == "ImageShowcase" =>'} {
    isGrid,
    heading,
    paragraph,
    cta {
      ${CtaQuery}
    },
    cta_Annotation,
    'images': img[] {
      ${Img_Query}
    },
  },
`;