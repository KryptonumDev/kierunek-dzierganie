import { ColumnImageSection_Query } from '../ColumnImageSection';
import Description from './Description';
export default Description;

export const Description_Query = /* groq */ `
  description[] {
    ${ColumnImageSection_Query}
  },
`;
