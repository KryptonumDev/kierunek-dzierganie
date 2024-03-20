import Faq from './Faq';
export default Faq;
export type { Props as FaqProps } from './Faq.types';

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
