'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Faq.module.scss';
import type { ListProps } from './Faq.types';

const List = ({ Indicator, list }: ListProps) => {
  const [opened, setOpened] = useState(0);
  const handleClick = (e: React.MouseEvent<HTMLElement>, i: number) => {
    e.preventDefault();
    setOpened(i);
  };

  return (
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
            {question}
            {Indicator}
          </summary>
          <motion.div
            className={styles.answer}
            initial={i === 0 ? { height: 'auto', marginBottom: '24px' } : { height: 0, marginBottom: 0 }}
            animate={opened === i ? { height: 'auto', marginBottom: '24px' } : { height: 0, marginBottom: 0 }}
            exit={{ height: 0, marginBottom: '0' }}
          >
            {answer}
          </motion.div>
        </details>
      ))}
    </div>
  );
};

export default List;
