import { Img_Query } from '@/components/ui/image';
import StepList from './StepList';
export type { Props as StepListProps } from './StepList.types';
export default StepList;

export const StepList_Query = `
  _type == "StepList" => {
    image{
      ${Img_Query}
    },
    heading,
    paragraph,
    list[] {
      title,
      description,
    },
  },
`;
