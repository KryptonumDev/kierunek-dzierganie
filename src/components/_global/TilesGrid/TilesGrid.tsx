import Link from 'next/link';
import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';
import styles from './TilesGrid.module.scss';
import { Decoration1 } from '@/components/ui/Icons';
import type { Props } from './TilesGrid.types';

const TilesGrid = ({ heading, paragraph, list }: Props) => {
  return (
    <section className={styles['TilesGrid']}>
      <Decoration1 className={styles.decoration} />
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.wrapper}>
        {list.map(({ img, cta, badge }, i) => (
          <div
            className={styles.item}
            key={i}
          >
            <Link
              href={cta.href}
              className={styles.img}
            >
              <div className={styles.badgeWrapper}>
                <Img
                  data={badge}
                  className={styles.badge}
                  sizes='(max-width: 499px) 80px, 125px'
                />
              </div>
              <Img
                data={img}
                className={styles.image}
                sizes='(max-width: 899px) 50vw, 400px'
              />
            </Link>
            <Button
              data={cta}
              className={styles.cta}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TilesGrid;
