'use client';
import { useState } from 'react';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';
import { motion } from 'framer-motion';
import SchemaFaq from '@/global/Schema/Faq';

const Faq = ({
  data: {
    heading,
    list,
  }
}) => {
  const [ opened, setOpened ] = useState(0);

  const handleClick = (e, i) => {
    e.preventDefault();
    setOpened(i);
  }

  return (
    <section className={styles.wrapper}>
      <Markdown.h2>{heading}</Markdown.h2>
      <div className={styles.list}>
        {list.map(({ question, answer }, i) => (
          <details
            key={i}
            open
            data-opened={opened === i}
          >
            <summary
              onClick={(e) => handleClick(e, i)}
              tabIndex={opened === i ? -1 : 0}
            >
              <Markdown components={{ p: 'span' }}>{question}</Markdown>
              <Indicator className={styles.indicator} />
            </summary>
            <motion.div
              className={styles.answer}
              initial={i === 0 ? { height: 'auto', marginBottom: '24px' } : { height: 0, marginBottom: 0 }}
              animate={opened === i ? { height: 'auto', marginBottom: '24px' } : { height: 0, marginBottom: 0 }}
              exit={{ height: 0, marginBottom: '0' }}
            >
              <Markdown>{answer}</Markdown>
            </motion.div>
          </details>
        ))}
      </div>
      <SchemaFaq data={list} />
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