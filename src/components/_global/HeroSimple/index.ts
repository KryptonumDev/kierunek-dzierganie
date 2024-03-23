import HeroSimple from './HeroSimple';
export default HeroSimple;
export type { HeroSimpleTypes } from './HeroSimple.types';

export const HeroSimple_Query = `
  HeroSimple {
    isHighlighted,
    heading,
    paragraph,
  },
`;
