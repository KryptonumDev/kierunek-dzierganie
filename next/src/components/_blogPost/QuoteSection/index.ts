import QuoteSection from './QuoteSection';
export default QuoteSection;
export type { QuoteSectionTypes } from './QuoteSection.types';

export const QuoteSection_Query = `
  _type == "QuoteSection" => {
    quote,
  },
`;