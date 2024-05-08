'use client';

import { type Node } from '@/global/types';
import styles from './TableOfContent.module.scss';
import Link from 'next/link';
import { smoothScroll } from '@/utils/smooth-scroll';
import { removeMarkdown } from '@/utils/remove-markdown';
import { useEffect, useRef, useState } from 'react';

const TableOfContent = ({ content }: { content: Node[] }) => {
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const contentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ref = contentRef.current;
    const handleScroll = () => {
      if (ref) {
        const element = contentRef.current;
        setScrollPercentage((element.scrollTop / (element.scrollHeight - element.offsetHeight)) * 100);
      }
    };

    ref?.addEventListener('scroll', handleScroll);
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  return (
    <nav
      className={styles['TableOfContent']}
      style={{ '--scrollPercentage': `${scrollPercentage}%` } as React.CSSProperties}
    >
      <header>
        <h2>
          <strong>W artykule znajdziesz:</strong>
        </h2>
      </header>
      <ul
        className={styles.unorderedList}
        ref={contentRef}
      >
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
    </nav>
  );
};

export default TableOfContent;
