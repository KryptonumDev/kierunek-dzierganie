import Faq from './Faq';
export type { Props as FaqProps } from './Faq.types';
export default Faq;

export const Faq_Query = `
  _type == 'Faq' => {
    _type,
    heading,
    paragraph,
    list[] -> {
      question,
      answer,
    }
  },
`;