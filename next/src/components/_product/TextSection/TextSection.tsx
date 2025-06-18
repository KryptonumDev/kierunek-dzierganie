import Markdown from '@/components/ui/markdown';
import styles from './TextSection.module.scss';
import type { TextSectionTypes } from './TextSection.types';

const TextSection = ({ heading, paragraph, secondParagraph }: TextSectionTypes) => {
  return (
    <section className={styles['TextSection']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      <div className={styles.column}>
        <Markdown>{paragraph}</Markdown>
        {secondParagraph && <Markdown>{secondParagraph}</Markdown>}
      </div>
    </section>
  );
};

export default TextSection;
