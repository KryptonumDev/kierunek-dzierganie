import { Img_Query } from '@/components/ui/image';
import ImageBadge from './ImageBadge';
export default ImageBadge;
export type { ImageBadgeTypes } from './ImageBadge.types';

export const ImageBadge_Query = `
  _type == "ImageBadge" => {
    badge,
    img {
      ${Img_Query}
    },
  },
`;
