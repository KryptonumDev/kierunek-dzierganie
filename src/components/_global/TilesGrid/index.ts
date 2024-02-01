import TilesGrid from './TilesGrid';
export type { Props as TilesGridProps } from './TilesGrid.types';
export default TilesGrid;

export const TilesGrid_Query = `
  _type == "TilesGrid" => {
    _type,
    heading,
    paragraph,
    list[]{
      img {
        asset -> {
          url,
          altText,
          metadata {
            lqip,
            dimensions {
              width,
              height,
            }
          }
        }
      },
      cta {
        text,
        href
      },
    },
  },
`;