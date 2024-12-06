import { Img_Query } from '@/components/ui/image';
import TilesIcon from './TilesIcon';
export type { Props as TilesIconProps } from './TilesIcon.types';
export default TilesIcon;

export const TilesIcon_Query = `
  _type == "TilesIcon" => {
    heading,
    paragraph,
    list[] {
      icon {
        ${Img_Query}
      },
      image {
        ${Img_Query}
      },
      title,
      description,
    },
  },
`;
