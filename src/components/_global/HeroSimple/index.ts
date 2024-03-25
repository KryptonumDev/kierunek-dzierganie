import HeroSimple from './HeroSimple';
export default HeroSimple;
export type { HeroSimpleTypes } from './HeroSimple.types';

export const HeroSimple_Query = (inline = false) => `
  ${inline ? 'HeroSimple {' : '_type == "HeroSimple" => {'}
    isHighlighted,
    heading,
    paragraph,
  },
`;
