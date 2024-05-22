import calculateReadingTime from '@/utils/calculate-reading-time';
import styles from './ReadingTime.module.scss';
import { type PortableTextBlock } from '@portabletext/react';

const ReadingTime = ({ portableText }: { portableText: [] }) => {
  const readingTime = calculateReadingTime(portableText as unknown as PortableTextBlock);
  return <p className={styles['ReadingTime']}>{readingTime} min czytania</p>;
};

export default ReadingTime;
