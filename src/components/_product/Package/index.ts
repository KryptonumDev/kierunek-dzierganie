import { PRODUCT_CARD_QUERY } from '@/global/constants';
import Package from './Package';
export default Package;
export type { PackageTypes } from './Package.types';

export const Package_Query = `
  courses[] -> {
    ${PRODUCT_CARD_QUERY}
  },
  package_Heading,
  package_Paragraph,
`;
