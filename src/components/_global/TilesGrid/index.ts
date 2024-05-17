import { Img_Query } from '@/components/ui/image';
import TilesGrid from './TilesGrid';
export type { Props as TilesGridProps } from './TilesGrid.types';
export default TilesGrid;

export const TilesGrid_Query = `
  _type == "TilesGrid" => {
    heading,
    paragraph,
    list[]{
      img {
        ${Img_Query}
      },
      cta {
        text,
        href
      },
    },
  },
`;
