import { Img_Query } from '@/components/ui/image';
import LogoSection from './LogoSection';
export default LogoSection;
export type { LogoSectionTypes } from './LogoSection.types';

export const LogoSection_Query = (inline = false) => `
  ${inline ? 'LogoSection {' : '_type == "LogoSection" => {'}
    logo {
      ${Img_Query}
    },
    heading,
    paragraph,
    optional_Paragraph,
  },
`;
