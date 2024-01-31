import TileList from './TileList';
export type { Props as TileListProps } from './TileList.types';
export default TileList;

export const TileList_Query = `
  _type == 'TileList' => {
    _type,
    heading,
    list[] {
      title,
      description,
    },
    paragraph,
    cta {
      text,
      href,
    },
    cta_Annotation,
  },
`;