'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './TabSection.module.scss';
import { easing } from '@/global/constants';

type Props = {
  list: {
    title: string;
    description: React.ReactNode;
  }[];
  icons: React.ReactNode[];
};

const Tabs = ({ list, icons }: Props) => {
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
            <motion.div
              layout
              initial={{ width: i === 0 ? 'auto' : 0 }}
              animate={{
                width: tab === i ? 'auto' : 0,
              }}
              exit={{ width: 0 }}
              style={{
                overflow: 'hidden',
              }}
              transition={{
                duration: 0.5,
                ease: easing,
              }}
            >
              {icons[i]}
            </motion.div>
            <span>{title}</span>
          </button>
        ))}
      </div>
      {list.map(({ description }, i) => (
        <motion.div
          style={{
            display: tab === i ? 'block' : 'none',
            opacity: tab === i ? 1 : 0,
          }}
          animate={{ opacity: tab === i ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={styles.item}
          key={i}
        >
          {description}
        </motion.div>
      ))}
    </div>
  );
};

export default Tabs;
