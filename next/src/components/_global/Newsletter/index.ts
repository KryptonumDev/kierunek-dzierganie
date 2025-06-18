import { Img_Query } from '@/components/ui/image';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import Newsletter from './Newsletter';
export type { Props as NewsletterProps } from './Newsletter.types';
export default Newsletter;

export const Newsletter_Query = `
  _type == 'Newsletter' => {
    heading,
    img {
      ${Img_Query}
    },
    groupId,
    dedicatedThankYouPage -> {
      name,
      'slug': slug.current,
      hasDiscount,
      discountCourse{
        discount,
        discountTime,
        course ->{
          ${PRODUCT_CARD_QUERY}
        }
      }

    },
  },
`;
