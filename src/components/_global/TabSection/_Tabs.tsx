'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './TabSection.module.scss';

type Props = {
  list: {
    title: string;
    description: React.ReactNode;
  }[];
};

const Tabs = ({ list }: Props) => {
  const [tab, setTab] = useState(0);

  return (
    <div className={styles['Tabs']}>
      <div className={styles.buttons}>
        {list.map(({ title }, i) => (
          <button
            key={i}
            aria-current={tab === i}
            onClick={() => setTab(i)}
          >
            {title}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {list.map(({ description }, i) => (
          <motion.div
            style={{
              display: tab === i ? 'block' : 'none',
              opacity: tab === i ? 1 : 0,
            }}
            animate={{ opacity: tab === i ? 1 : 0 }}
            transition={{ duration: .5 }}
            className={styles.item}
            key={i}
          >
            {description}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
