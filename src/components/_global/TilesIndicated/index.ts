import { Img_Query } from '@/components/ui/image';
import TilesIndicated from './TilesIndicated';
export type { Props as TilesIndicatedProps } from './TilesIndicated.types';
export default TilesIndicated;

export const TilesIndicated_Query = `
  _type == "TilesIndicated" => {
    heading,
    list[] {
      image {
        ${Img_Query}
      },
      title,
      paragraph,
      cta {
        text,
        href,
      },
    },
  },
`;
