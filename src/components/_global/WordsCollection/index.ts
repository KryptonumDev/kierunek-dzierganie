import { Img_Query } from '@/components/ui/image';
import WordsCollection from './WordsCollection';
export type { Props as WordsCollectionProps } from './WordsCollection.types';
export default WordsCollection;

export const WordsCollection_Query = `
  _type == "WordsCollection" => {
    image {
      ${Img_Query}
    },
    heading,
    list[],
    cta {
      text,
      href
    },
  },
`;
