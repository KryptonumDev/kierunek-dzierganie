import { Img_Query } from '@/components/ui/image';
import { PRODUCT_CARD_QUERY } from '@/global/constants';
import ProductOptionsSection from './ProductOptionsSection';
export type { Props as ProductOptionsSectionProps } from './ProductOptionsSection.types';
export default ProductOptionsSection;

export const ProductOptionsSection_Query = `
  _type == "ProductOptionsSection" => {
    heading,
    paragraph,
    list[]{
      _key,
      _type,
      img {
        ${Img_Query}
      },
      heading,
      paragraph,
      groupId,
      buttonLabel,
      dedicatedThankYouPage -> {
        name,
        'slug': slug.current,
        hasDiscount,
        discountCourse {
          discount,
          discountTime,
          course -> {
            ${PRODUCT_CARD_QUERY}
          }
        }
      },
      cta {
        text,
        href
      },
    },
  },
`;
