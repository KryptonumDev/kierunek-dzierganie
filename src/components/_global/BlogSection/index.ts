import { Img_Query } from '@/components/ui/image';
import BlogSection from './BlogSection';
export default BlogSection;
export type { BlogSectionTypes } from './BlogSection.types';

export const BlogSection_Query = `
  blog_Heading,
  blog_Paragraph,
  blog_HighlightedPost-> {
    hero_Img {
      ${Img_Query}
    },
    hero_Heading,
    hero_Paragraph,
    hero_Author-> {
      heading,
      paragraph,
      img {
        ${Img_Query}
      },
    },
  },
`;
