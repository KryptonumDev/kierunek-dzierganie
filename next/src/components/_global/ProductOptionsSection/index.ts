import { Img_Query } from '@/components/ui/image';
import ProductOptionsSection from './ProductOptionsSection';
export type { Props as ProductOptionsSectionProps } from './ProductOptionsSection.types';
export default ProductOptionsSection;

export const ProductOptionsSection_Query = `
  _type == "ProductOptionsSection" => {
    heading,
    paragraph,
    list[]{
      img {
        ${Img_Query}
      },
      heading,
      paragraph,
      cta {
        text,
        href
      },
    },
  },
`;
