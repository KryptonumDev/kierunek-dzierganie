import Bonuses from './Bonuses';
import { Props } from './Bonuses.types';
export type { Props as BonusesProps };
export default Bonuses;

export const Bonuses_Query = `
  _type == 'Bonuses' => {
    heading,
    list[] {
      description,
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
      }
    }
  },
`;