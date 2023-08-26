'use client';
import { useState } from 'react';
import Heading from '@/utils/Heading';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import SchemaFaq from '@/global/SchemaFaq';

const Faq = ({
  data: {
    faq_Heading,
    faq_List,
  }
}) => {
  const [ opened, setOpened ] = useState(0);

  const handleClick = (e, i) => {
    e.preventDefault();
    setOpened(i);
  }

  return (
    <section className={styles.wrapper}>
      <Heading level='h2'>{faq_Heading}</Heading>
      <div className={styles.list}>
        {faq_List.map((item, i) => (
          <details key={i} open data-opened={opened === i}>
            <summary onClick={(e) => handleClick(e, i)}>
              <Markdown components={{ p: 'span' }}>{item.question}</Markdown>
              <Indicator className={styles.indicator} />
            </summary>
            <AnimatePresence mode="wait">
              {opened === i && (
                <motion.div
                  className={styles.answer}
                  initial={{ height: 0, marginBottom: '0'}}
                  animate={{ height: 'auto', marginBottom: '24px' }}
                  exit={{ height: 0, marginBottom: '0' }}
                >
                  <Markdown>{item.answer}</Markdown>
                </motion.div>
              )}
            </AnimatePresence>
          </details>
        ))}
      </div>
      <SchemaFaq data={faq_List} />
    </section>
  );
};

export default Faq;

const Indicator = ({ ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none' {...props}>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='0.75'
      d='M1 11h20M11 1v20'
    ></path>
  </svg>
)