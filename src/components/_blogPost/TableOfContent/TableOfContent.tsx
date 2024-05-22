'use client';

import { type Node } from '@/global/types';
import styles from './TableOfContent.module.scss';
import Link from 'next/link';
import { smoothScroll } from '@/utils/smooth-scroll';
import { removeMarkdown } from '@/utils/remove-markdown';
import { useEffect, useState } from 'react';

const TableOfContent = ({ content }: { content: Node[] }) => {
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      const scrollPercentage = (scrollPosition / (totalHeight - windowHeight)) * 100;
      setProgressPercentage(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={styles['TableOfContent']}
      style={{ '--progressPercentage': `${progressPercentage}%` } as React.CSSProperties}
    >
      <header>
        <h2>
          <strong>W artykule znajdziesz:</strong>
        </h2>
      </header>
      <div>
        <span className={styles.progressBar} />
        <ul className={styles.unorderedList}>
          {content.map(({ text, slug, subheadings }, index) => (
            <li
              key={index}
              className={styles.list}
            >
              <Link
                href={`#${slug}`}
                onClick={(e) => smoothScroll(e, slug)}
                className={styles.link}
              >
                <span>{removeMarkdown(text as string)}</span>
              </Link>
              {(subheadings?.length ?? 0) > 0 && (
                <ul className={styles.subList}>
                  {subheadings?.map(({ text, slug }, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        href={`#${slug}`}
                        onClick={(e) => smoothScroll(e, slug)}
                        className={styles.link}
                      >
                        <span>{removeMarkdown(text as string)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContent;
