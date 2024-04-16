import TilesIndicated from './TilesIndicated';
export type { Props as TilesIndicatedProps } from './TilesIndicated.types';
export default TilesIndicated;

export const TilesIndicated_Query = `
  _type == "TilesIndicated" => {
    heading,
    list[] {
      title,
      paragraph,
      cta {
        text,
        href,
      },
    },
  },
`;
