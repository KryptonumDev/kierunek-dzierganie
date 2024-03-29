import TextSection from './TextSection';
export default TextSection;
export type { TextSectionTypes } from './TextSection.types';

export const TextSection_Query = `
  _type == "TextSection" => {
    _type,
    heading,
    paragraph,
    secondParagraph,
  },
`;
