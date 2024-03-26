import TableSection from './TableSection';
export default TableSection;
export type { TableSectionTypes } from './TableSection.types';

export const TableSection_Query = `
  _type == "TableSection" => {
    table[] {
      title,
      description,
    }
  },
`;
