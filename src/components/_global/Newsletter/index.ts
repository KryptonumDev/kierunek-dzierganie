import { Img_Query } from '@/components/ui/image';
import Newsletter from './Newsletter';
export type { Props as NewsletterProps } from './Newsletter.types';
export default Newsletter;

export const Newsletter_Query = `
  _type == 'Newsletter' => {
    _type,
    heading,
    img {
      ${Img_Query}
    },
  },
`;
