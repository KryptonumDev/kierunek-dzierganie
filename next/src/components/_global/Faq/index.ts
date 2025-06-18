import Faq from './Faq';
export default Faq;
export type { FaqTypes } from './Faq.types';

export const Faq_Query = `
  _type == 'Faq' => {
    heading,
    paragraph,
    list[] -> {
      question,
      answer,
    }
  },
`;
