import LatestBlogEntries from './LatestBlogEntries';
export default LatestBlogEntries;
export type { LatestBlogEntriesTypes } from './LatestBlogEntries.types';

export const LatestBlogEntries_Query = (inline = false) => `
  ${inline ? 'LatestBlogEntries {' : '_type == "LatestBlogEntries" => {'}
    heading,
    paragraph,
    "entries": *[_type == "BlogPost_Collection"] {
      hero_Heading,
      "slug": slug.current,
    } | order(_createdAt desc)[0...3],
  },
`;
