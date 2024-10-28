import { Img_Query } from '@/components/ui/image';
import Community from './Community';
export type { Props as CommunityProps } from './Community.types';
export default Community;

export const Community_Query = `
  _type == "Community" => {
    backgroundImage{
      ${Img_Query}
    },
    heading,
    paragraph,
    cta {
      text,
      href,
    },
  },
`;
