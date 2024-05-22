import { Img_Query } from '@/components/ui/image';
import CustomerCaseStudy from './CustomerCaseStudy';
export type { Props as CustomerCaseStudyProps } from './CustomerCaseStudy.types';
export default CustomerCaseStudy;

export const CustomerCaseStudy_Query = `
  _type == "CustomerCaseStudy" => {
    heading,
    paragraph,
    list[] -> {
      name,
      'slug': slug.current,
      excerpt,
      img {
        ${Img_Query}
      }
    },
  },
`;
