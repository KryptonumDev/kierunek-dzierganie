import { Img_Query } from '@/components/ui/image';
import ImageHeading from './ImageHeading';
export default ImageHeading;
export type { ImageHeadingTypes } from './ImageHeading.types';

export const ImageHeading_Query = `
  _type == 'imageHeading' => {
    image{
      ${Img_Query}
    },
    heading,
    paragraph,
  },
`;
