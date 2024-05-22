import Markdown from '@/components/ui/markdown';
import styles from './UnorderedList.module.scss';
import type { UnorderedListTypes } from './UnorderedList.types';

const UnorderedList = ({ heading, paragraph, list }: UnorderedListTypes) => {
  const formattedList = list.map((item) => `- ${item}`).join('\n');

  return (
    <section className={styles['UnorderedList']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      {paragraph && <Markdown className={styles.paragraph}>{paragraph}</Markdown>}
      <Markdown className={styles.list}>{formattedList}</Markdown>
    </section>
  );
};

export default UnorderedList;
