import { Img_Query } from '@/components/ui/image';
import ColumnImageSection from './ColumnImageSection';
export default ColumnImageSection;
export type { ColumnImageSectionTypes } from './ColumnImageSection.types';

export const ColumnImageSection_Query = `
  _type == "ColumnImageSection" => {
    _type,
    isReversed,
    heading,
    suhheading,
    paragraph,
    img {
      ${Img_Query}
    },
  },
`;
