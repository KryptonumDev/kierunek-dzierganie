import { Img_Query } from '@/components/ui/image';
import Introduction from './Introduction';
export type { Props as IntroductionProps } from './Introduction.types';
export default Introduction;

export const Introduction_Query = (inline = false) => `
  ${inline ? 'Introduction' : '_type == "Introduction" =>'} {
    isReversed,
    heading,
    paragraph,
    cta {
      text,
      href,
    },
    img {
      ${Img_Query}
    },
  },
`;