import { Img_Query } from '@/components/ui/image';
import Hero from './Hero';
export default Hero;
export type { HeroTypes } from './Hero.types';

export const Hero_Query = `
  hero {
    img {
      ${Img_Query}
    },
    heading,
    paragraph,
  },
`;
