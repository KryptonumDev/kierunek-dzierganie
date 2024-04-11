import { Img_Query } from '@/components/ui/image';
import LatestBlogEntries from './LatestBlogEntries';
export default LatestBlogEntries;
export type { LatestBlogEntriesTypes } from './LatestBlogEntries.types';

export const LatestBlogEntries_Query = (inline = false) => `
  ${inline ? 'LatestBlogEntries {' : '_type == "LatestBlogEntries" => {'}
    heading,
    paragraph,
    "entries": *[_type == "BlogPost_Collection"] {
      hero {
        heading,
        paragraph,
        img {
          ${Img_Query}
        }
      },
      "slug": slug.current,
    } | order(_createdAt desc)[0..2]
  },
`;
