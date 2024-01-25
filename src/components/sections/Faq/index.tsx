import Markdown from '@/utils/markdown';
import styles from './styles.module.scss';
import List from './list';

type Props = {
  heading: string;
  list: {
    question: string;
    answer: string;
  }[];
};

const Faq = ({
  heading,
  list
}: Props) => {
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
