import Markdown from '@/components/ui/markdown';
import styles from './CompaniesShowcase.module.scss';
import type { CompaniesShowcaseTypes } from './CompaniesShowcase.types';
import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import Link from 'next/link';

const CompaniesShowcase = ({ heading, paragraph, cta, list }: CompaniesShowcaseTypes) => {
  return (
    <section className={styles['CompaniesShowcase']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
        {cta && <Button data={cta} />}
      </header>
      <div className={styles.list}>
        {list.map(({ img, description, title, href }, i) => {
          const children = (
            <>
              <div className={styles.imageWrapper}>
                <Img
                  data={img}
                  sizes='256px'
                />
              </div>
              <div className={styles.text}>
                <Markdown.h3>{title}</Markdown.h3>
                <Markdown>{description}</Markdown>
              </div>
            </>
          );
          return href ? (
            <Link
              href={href}
              className={`${styles.item} ${styles.link}`}
              key={i}
            >
              {children}
            </Link>
          ) : (
            <div
              className={styles.item}
              key={i}
            >
              {children}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CompaniesShowcase;
