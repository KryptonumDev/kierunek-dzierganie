import Markdown from '@/components/ui/markdown';
import styles from './LatestBlogEntries.module.scss';
import type { LatestBlogEntriesTypes } from './LatestBlogEntries.types';
import Img from '@/components/ui/image';
import Link from 'next/link';

const LatestBlogEntries = ({ heading, paragraph, entries }: LatestBlogEntriesTypes) => {
  return (
    <section className={styles['LatestBlogEntries']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.blogPosts}>
        {entries.map(({ hero: { heading, img, paragraph }, slug }, index) => {
          return (
            <Link
              key={index}
              className={styles.entry}
              href={`/blog/${slug}`}
            >
              <Img
                data={img}
                sizes='(max-width: 499px) 100vw, (max-width: 999px) 50vw, 33vw'
              />
              <div className={styles.text}>
                <Markdown.h3>{heading}</Markdown.h3>
                <Markdown>{paragraph}</Markdown>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default LatestBlogEntries;
