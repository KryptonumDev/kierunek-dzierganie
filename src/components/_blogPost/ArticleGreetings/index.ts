import { Img_Query } from '@/components/ui/image';
import ArticleGreetings from './ArticleGreetings';
export default ArticleGreetings;
export type { ArticleGreetingsTypes } from './ArticleGreetings.types';

export const ArticleGreetings_Query = `
  _type == "ArticleGreetings" => {
    text,
    author-> {
      img {
        ${Img_Query}
      },
      name,
    },
  },
`;
