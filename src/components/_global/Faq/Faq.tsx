import Markdown from '@/components/ui/markdown';
import styles from './Faq.module.scss';
import List from './_List';
import type { Props } from './Faq.types';

const Faq = ({ heading, list }: Props) => {
  const formattedList = list.map(({ question, answer }) => ({
    question: <Markdown.span>{question}</Markdown.span>,
    answer: <Markdown>{answer}</Markdown>,
  }));

  return (
    <section className={styles.Faq}>
      <Markdown.h2>{heading}</Markdown.h2>
      <List
        list={formattedList}
        Indicator={Indicator}
      />
      {/* <SchemaFaq list={list} /> */}
    </section>
  );
};

export default Faq;

const Indicator = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='22'
    height='22'
    viewBox='0 0 22 22'
    fill='none'
    className={styles.indicator}
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='0.75'
      d='M1 11h20M11 1v20'
    ></path>
  </svg>
);