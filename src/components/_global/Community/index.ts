import Community from './Community';
export type { Props as CommunityProps } from './Community.types';
export default Community;

export const Community_Query = `
  _type == "Community" => {
    isHighlighted,
    heading,
    paragraph,
    cta {
      text,
      href,
    },
  },
`;