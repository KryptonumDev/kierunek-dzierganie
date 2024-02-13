import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './TilesIndicated.module.scss';
import type { Props } from './TilesIndicated.types';
import { Arrow1 } from './_Arrow1';
import { Arrow2 } from './_Arrow2';

const TilesIndicated = ({ heading, list }: Props) => {
  return (
    <section className={styles['TilesIndicated']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <div className={styles.arrows}>
          <Arrow1 className={styles.arrow1} />
          <Arrow2 className={styles.arrow2} />
        </div>
      </header>
      <div className={styles.wrapper}>
        {list.map(({ title, paragraph, cta }, i) => (
          <div
            className={styles.item}
            key={i}
          >
            <Markdown.h3>{title}</Markdown.h3>
            <Markdown className={styles.paragraph}>{paragraph}</Markdown>
            <Button data={cta} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TilesIndicated;