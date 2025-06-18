import { Img_Query } from '@/components/ui/image';
import HighlightedImage from './HighlightedImage';
export default HighlightedImage;
export type { HighlightedImageTypes } from './HighlightedImage.types';

export const HighlightedImage_Query = `
  _type == "HighlightedImage" => {
    paragraph,
    img {
      ${Img_Query}
    },
    isBackground,
  },
`;
