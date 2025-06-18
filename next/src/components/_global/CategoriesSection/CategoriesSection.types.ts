export type CategoriesSectionTypes = {
  data: {
    categories_Heading: string;
    categories_Paragraph: string;
    blogPosts: {
      categories: {
        name: string;
        slug: string;
      }[];
    }[];
    highlightedCategory?: string;
  };
};
