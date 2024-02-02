import TilesFeatures from './TilesFeatures';
export type { Props as TilesFeaturesProps } from './TilesFeatures.types';
export default TilesFeatures;

export const TilesFeatures_Query = `
  _type == "TilesFeatures" => {
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
      heading,
      paragraph,
    },
  },
`;