import Markdown from '@/components/ui/markdown';
import styles from './Standout.module.scss';
import type { StandoutTypes } from './Standout.types';

const Standout = ({ heading, paragraph }: StandoutTypes) => {
  return (
    <div className={styles['Standout']}>
      <Markdown.h2>{heading}</Markdown.h2>
      <Markdown>{paragraph}</Markdown>
    </div>
  );
};

export default Standout;
