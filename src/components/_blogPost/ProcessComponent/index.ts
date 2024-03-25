import { Img_Query } from '@/components/ui/image';
import ProcessComponent from './ProcessComponent';
export default ProcessComponent;
export type { ProcessComponentTypes } from './ProcessComponent.types';

export const ProcessComponent_Query = `
  _type == "ProcessComponent" => {
    list[] {
      paragraph,
      img {
        ${Img_Query}
      },
    }
  },
`;
