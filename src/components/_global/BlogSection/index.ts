import { Img_Query } from '@/components/ui/image';
import BlogSection from './BlogSection';
export default BlogSection;
export type { BlogSectionTypes } from './BlogSection.types';

export const BlogSection_Query = `
  blog_Heading,
  blog_Paragraph,
  blog_HighlightedPost-> {
    "slug": slug.current,
    hero {
      img {
        ${Img_Query}
      },
      heading,
      paragraph,
      author-> {
        heading,
        paragraph,
        img {
          ${Img_Query}
        },
      },
    },
  },
`;
