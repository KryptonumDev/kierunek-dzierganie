import LatestBlogEntries from './LatestBlogEntries';
export default LatestBlogEntries;
export type { LatestBlogEntriesTypes } from './LatestBlogEntries.types';

// TODO: Change the query if there will be a blog posts available.
export const LatestBlogEntries_Query = (inline = false) => `${inline ? '' : ''}`;

// export const LatestBlogEntries_Query = (inline = false) => `
//   ${inline ? 'LatestBlogEntries {' : '_type == "LatestBlogEntries" => {'}
//     _type,
//     heading,
//     paragraph,
//     "entries": *[_type == "BlogPost_Collection"] {
//       hero_Heading,
//       "slug": slug.current,
//     } | order(_createdAt desc)[0...3],
//   },
// `;
