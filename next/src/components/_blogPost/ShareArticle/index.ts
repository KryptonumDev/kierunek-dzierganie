import ShareArticle from './ShareArticle';
export default ShareArticle;
export type { ShareArticleTypes } from './ShareArticle.types';

export const ShareArticle_Query = `
  "links": *[_id=="global"][0] {
    facebook,
    pinterest
  },
`;
