import BadgeSection from './BadgeSection';
export default BadgeSection;
export type { BadgeSectionTypes } from './BadgeSection.types';

export const BadgeSection_Query = `
  _type == "BadgeSection" => {
    badge
  },
`;
