import WordsCollection from './WordsCollection';
export type { Props as WordsCollectionProps } from './WordsCollection.types';
export default WordsCollection;

export const WordsCollection_Query = `
  _type == "WordsCollection" => {
    heading,
    list[],
    cta {
      text,
      href
    },
  },
`;