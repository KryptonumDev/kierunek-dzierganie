import StepList from './StepList';
export type { Props as StepListProps } from './StepList.types';
export default StepList;

export const StepList_Query = `
  _type == "StepList" => {
    heading,
    paragraph,
    list[] {
      title,
      description,
    },
  },
`;
