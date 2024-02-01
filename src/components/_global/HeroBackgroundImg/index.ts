import HeroBackgroundImg from './HeroBackgroundImg';
export type { Props as HeroBackgroundImgProps } from './HeroBackgroundImg.types';
export default HeroBackgroundImg;

export const HeroBackgroundImg_Query = `
  _type == "HeroBackgroundImg" => {
    _type,
    isReversed,
    heading,
    paragraph,
    cta {
      text,
      href
    },
    cta_Annotation,
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
  },
`;