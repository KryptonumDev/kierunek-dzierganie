import Markdown from '@/components/ui/markdown';
import styles from './TextSection.module.scss';
import type { TextSectionTypes } from './TextSection.types';

const TextSection = ({ heading, paragraph }: TextSectionTypes) => {
  return (
    <section className={styles['TextSection']}>
      <Markdown.h2>{heading}</Markdown.h2>
      <Markdown className={styles.paragraph}>{paragraph}</Markdown>
    </section>
  );
};

export default TextSection;
