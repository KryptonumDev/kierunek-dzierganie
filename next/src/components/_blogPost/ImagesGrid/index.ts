import { Img_Query } from '@/components/ui/image';
import ImagesGrid from './ImagesGrid';
export default ImagesGrid;
export type { ImagesGridTypes } from './ImagesGrid.types';

export const ImagesGrid_Query = `
  _type == "ImagesGrid" => {
    list[] {
      img {
        ${Img_Query}
      },
      paragraph,
    },
  },
`;
