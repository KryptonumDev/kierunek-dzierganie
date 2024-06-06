import UnorderedList from './UnorderedList';
export default UnorderedList;
export type { UnorderedListTypes } from './UnorderedList.types';

export const UnorderedList_Query = `
  _type == "UnorderedList" => {
    _type,
    heading,
    paragraph,
  },
`;
