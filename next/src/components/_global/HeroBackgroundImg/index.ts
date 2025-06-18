import { Img_Query } from '@/components/ui/image';
import HeroBackgroundImg from './HeroBackgroundImg';
export type { Props as HeroBackgroundImgProps } from './HeroBackgroundImg.types';
export default HeroBackgroundImg;

export const HeroBackgroundImg_Query = `
  _type == "HeroBackgroundImg" => {
    isReversed,
    heading,
    paragraph,
    cta {
      text,
      href
    },
    cta_Annotation,
    img {
      ${Img_Query}
    }
  },
`;