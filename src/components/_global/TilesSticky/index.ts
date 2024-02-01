import TilesSticky from './TilesSticky';
export type { Props as TilesStickyProps } from './TilesSticky.types';
export default TilesSticky;

export const TilesSticky_Query = `
  _type == "TilesSticky" => {
    _type,
    heading,
    paragraph,
    cta,
    list[] {
      heading,
      paragraph,
    },
  },
`;