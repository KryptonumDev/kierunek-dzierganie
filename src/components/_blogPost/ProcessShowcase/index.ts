import { Img_Query } from '@/components/ui/image';
import ProcessShowcase from './ProcessShowcase';
export default ProcessShowcase;
export type { ProcessShowcaseTypes } from './ProcessShowcase.types';

export const ProcessShowcase_Query = `
  _type == "ProcessShowcase" => {
    list[] {
      heading,
      process[] {
        img {
          ${Img_Query}
        },
        paragraph,
      },
    },
  },
`;
