import { CtaQuery } from '@/components/ui/Button';
import CompaniesShowcase from './CompaniesShowcase';
import { Img_Query } from '@/components/ui/image';
export default CompaniesShowcase;
export type { CompaniesShowcaseTypes } from './CompaniesShowcase.types';

export const CompaniesShowcase_Query = `
  _type == "CompaniesShowcase" => {
    heading,
    paragraph,
    cta {
      ${CtaQuery}
    },
    list[] {
      title,
      description,
      img {
        ${Img_Query}
      }
    }
  },
`;
