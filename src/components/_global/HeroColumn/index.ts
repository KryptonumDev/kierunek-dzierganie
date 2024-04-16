import { Img_Query } from '@/components/ui/image';
import HeroColumn from './HeroColumn';
export type { Props as HeroColumnProps } from './HeroColumn.types';
export default HeroColumn;

export const HeroColumn_Query = `
  _type == 'HeroColumn' => {
    heading,
    paragraph,
    img {
      ${Img_Query}
    },
  },
`;
