import { Img_Query } from '@/components/ui/image';
import TilesGallery from './TilesGallery';
export default TilesGallery;
export type { Props as TilesGalleryProps } from './TilesGallery.types';

export const TilesGallery_Query = `
  _type == "TilesGallery" => {
    heading,
    paragraph,
    cta,
    list[] {
      img {
        ${Img_Query}
      },
      heading,
      paragraph,
    },
  },
`;
