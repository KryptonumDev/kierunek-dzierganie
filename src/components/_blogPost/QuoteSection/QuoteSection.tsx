import styles from './QuoteSection.module.scss';
import type { QuoteSectionTypes } from './QuoteSection.types';

const QuoteSection = ({ quote }: QuoteSectionTypes) => {
  console.log(quote);
  return <section className={styles['QuoteSection']}></section>;
};

export default QuoteSection;
