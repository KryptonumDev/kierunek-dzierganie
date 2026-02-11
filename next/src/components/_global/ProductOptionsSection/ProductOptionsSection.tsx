import type { CSSProperties } from 'react';
import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './ProductOptionsSection.module.scss';
import type { Props } from './ProductOptionsSection.types';

const ProductOptionsSection = ({ heading, paragraph, list }: Props) => {
  const columns = Math.min(Math.max(list.length, 2), 3);
  const gridStyle = { '--columns': columns } as CSSProperties;

  return (
    <section className={styles['ProductOptionsSection']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        {paragraph && <Markdown className={styles.paragraph}>{paragraph}</Markdown>}
      </header>
      <div className={styles.tiles} style={gridStyle}>
        {list.map(({ img, heading, paragraph, cta }, i) => (
          <article className={styles.item} key={`${cta.href}-${i}`}>
            <Img
              data={img}
              className={styles.image}
              sizes='(max-width: 699px) 100vw, (max-width: 1023px) 50vw, 400px'
            />
            <Markdown.h3>{heading}</Markdown.h3>
            <Markdown className={styles.description}>{paragraph}</Markdown>
            <Button
              data={cta}
              className={styles.cta}
            />
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductOptionsSection;
