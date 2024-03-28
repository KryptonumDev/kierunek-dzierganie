import Markdown from '@/components/ui/markdown';
import styles from './LatestBlogEntries.module.scss';
import type { LatestBlogEntriesTypes } from './LatestBlogEntries.types';

const LatestBlogEntries = ({ heading, paragraph }: LatestBlogEntriesTypes) => {
  return;
  return (
    <section className={styles['LatestBlogEntries']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
    </section>
  );
};

export default LatestBlogEntries;
