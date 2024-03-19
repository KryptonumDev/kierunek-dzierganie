import CategoriesSection from './CategoriesSection';
export default CategoriesSection;
export type { CategoriesSectionTypes } from './CategoriesSection.types';

export const CategoriesSection_Query = `
  categories_Heading,
  categories_Paragraph,
  "blogPosts": *[_type=="BlogPost_Collection"][] {
    "categories": category[]-> {
      name,
      "slug": slug.current,
   },
  },
`;
