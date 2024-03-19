import CategoriesSection from './CategoriesSection';
export default CategoriesSection;
export type { CategoriesSectionTypes } from './CategoriesSection.types';

export const CategoriesSection_Query = `
  categories_Heading,
  categories_Paragraph,
  "categories": *[_type=="BlogCategory_Collection"][] {
    name,
    "slug": slug.current,
  },
`;