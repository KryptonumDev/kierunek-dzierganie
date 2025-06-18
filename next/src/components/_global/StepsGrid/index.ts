import StepsGrid from './StepsGrid';
export default StepsGrid;
import { Img_Query } from '@/components/ui/image';
export type { StepsGridTypes } from './StepsGrid.types';

export const StepsGrid_Query = `
  StepsGrid {
    heading,
    paragraph,
    list[] {
      relatedCourse -> {
        "slug": slug.current,
        basis
      },
      img {
        ${Img_Query}
      },
      heading,
      paragraph,
    },
  },
`;
