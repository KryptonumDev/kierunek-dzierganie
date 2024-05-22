import { Img_Query } from '@/components/ui/image';
import TilesFeatures from './TilesFeatures';
export type { Props as TilesFeaturesProps } from './TilesFeatures.types';
export default TilesFeatures;

export const TilesFeatures_Query = `
  _type == "TilesFeatures" => {
    heading,
    paragraph,
    list[]{
      img {
        ${Img_Query}
      },
      heading,
      paragraph,
    },
  },
`;