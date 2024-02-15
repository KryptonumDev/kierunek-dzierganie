import { Img_Query } from '@/components/ui/image';
import Partners from './Partners';
export type { Props as PartnersProps } from './Partners.types';
export default Partners;

export const Partners_Query = `
  _type == "Partners" => {
    _type,
    heading,
    paragraph,
    cta {
      text,
      href,
    },
    list[] -> {
      img {
        ${Img_Query}
      },
      name,
      description,
    },
  },
`;
