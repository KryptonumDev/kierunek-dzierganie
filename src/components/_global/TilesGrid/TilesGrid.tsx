import Markdown from '@/components/ui/markdown';
import styles from './TilesGrid.module.scss';
import type { Props } from './TilesGrid.types';
import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';
import { Decoration1 } from '@/components/ui/Icons';

const TilesGrid = ({ heading, paragraph, list }: Props) => {
  return (
    <section className={styles['TilesGrid']}>
      <Decoration1 className={styles.decoration} />
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.wrapper}>
        {list.map(({ img, cta }, i) => (
          <div className={styles.item} key={i}>
            <div className={styles.img}>
              <Img data={img} sizes='(max-width: 899px) 50vw, 400px' />
            </div>
            <Button data={cta} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TilesGrid;