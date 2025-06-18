import { type ImgType } from '@/global/types';

export type ArticleGreetingsTypes = {
  text: string;
  author: {
    img: ImgType;
    name: string;
  };
};
