import Markdown from '@/components/ui/markdown';
import styles from './LatestBlogEntries.module.scss';
import type { LatestBlogEntriesTypes } from './LatestBlogEntries.types';
import Img from '@/components/ui/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ReadingTime from '@/components/ui/ReadingTime';

const LatestBlogEntries = ({ heading, paragraph, entries }: LatestBlogEntriesTypes) => {
  return (
    <section className={styles['LatestBlogEntries']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.blogPosts}>
        {entries.map(({ hero: { heading, img, paragraph }, slug, portableText }, index) => {
          return (
            <div
              key={index}
              className={styles.item}
            >
              <Link href={`/blog/${slug}`} />
              <div className={styles.imageWrapper}>
                <Img
                  data={img}
                  sizes='(max-width: 499px) 100vw, (max-width: 999px) 50vw, 33vw'
                />
                <ReadingTime portableText={portableText} />
              </div>
              <div className={styles.text}>
                <Markdown.h3>{heading}</Markdown.h3>
                <Markdown>{paragraph}</Markdown>
              </div>
            </div>
          );
        })}
      </div>
      <Button href='/blog'>Przejdź do bloga</Button>
    </section>
  );
};

export default LatestBlogEntries;
