import { Img_Query } from '@/components/ui/image';
import TeamShowcase from './TeamShowcase';
import { CtaQuery } from '@/components/ui/Button';
export default TeamShowcase;
export type { TeamShowcaseTypes } from './TeamShowcase.types';

export const TeamShowcase_Query = `
  _type == "TeamShowcase" => {
    heading,
    paragraph,
    list[] {
      title,
      description,
      isLeftSide,
      img {
        ${Img_Query}
      }
    },
    cta {
      ${CtaQuery}
    },
  },
`;
