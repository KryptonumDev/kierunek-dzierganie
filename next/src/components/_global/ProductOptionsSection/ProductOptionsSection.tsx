import type { CSSProperties } from 'react';
import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './ProductOptionsSection.module.scss';
import NewsletterItem from './_NewsletterItem';
import type { ProductOptionsSectionCardItem, Props } from './ProductOptionsSection.types';

const isCardItem = (item: Props['list'][number]): item is ProductOptionsSectionCardItem =>
  item._type === 'ProductOptionsSection_Item';

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
        {list.map((item, i) => {
          if (!isCardItem(item)) {
            return (
              <NewsletterItem
                key={item._key || `${item.heading}-${i}`}
                {...item}
              />
            );
          }

          return (
            <article className={styles.item} key={item._key || `${item.cta.href}-${i}`}>
              <Img
                data={item.img}
                className={styles.image}
                sizes='(max-width: 699px) 100vw, (max-width: 1023px) 50vw, 400px'
              />
              <Markdown.h3>{item.heading}</Markdown.h3>
              <Markdown className={styles.description}>{item.paragraph}</Markdown>
              <Button
                data={item.cta}
                className={styles.cta}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProductOptionsSection;
