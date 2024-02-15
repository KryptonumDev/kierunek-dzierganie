'use client';
import { useRef } from 'react';
import styles from './WordsCollection.module.scss';
import type { ListItemProps, ListProps } from './WordsCollection.types';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const List = ({ list }: ListProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <ul
      className={styles.list}
      ref={ref}
    >
      {list.map(({ text, marginLeft, y }, i) => (
        <ListItem
          key={i}
          marginLeft={marginLeft}
          scrollYProgress={scrollYProgress}
          y={y}
        >
          {text}
        </ListItem>
      ))}
    </ul>
  );
};

const ListItem = ({ marginLeft, y, scrollYProgress, children }: ListItemProps) => {
  const progress = useSpring(useTransform(scrollYProgress, [0, 1], [0, y]), {
    stiffness: 500,
    damping: 150,
  });


  return (
    <motion.li
      className={styles.item}
      style={{ marginLeft, y: progress }}
    >
      {children}
    </motion.li>
  );
};

export default List;
