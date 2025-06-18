import { Img_Query } from '@/components/ui/image';
import LargeImage from './LargeImage';
export default LargeImage;

export const LargeImage_Query = `
  _type == "LargeImage" => {
    ${Img_Query}
  },
`;
