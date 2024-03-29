import { ColumnImageSection_Query } from '../ColumnImageSection';
import { OrderedList_Query } from '../OrderedList';
import { TextSection_Query } from '../TextSection';
import Description from './Description';
export default Description;

export const Description_Query = /* groq */ `
  description[] {
    ${ColumnImageSection_Query}
    ${TextSection_Query}
    ${OrderedList_Query}
  },
`;
