import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './TilesSticky.module.scss';
import type { Props } from './TilesSticky.types';

const TilesSticky = ({ heading, paragraph, cta, list }: Props) => {
  return (
    <section className={styles['TilesSticky']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
        {cta && <Button data={cta} />}
      </header>
      <div className={styles.wrapper}>
        {list.map(({ heading, paragraph }, i) => (
          <div
            className={styles.item}
            key={i}
          >
            <Markdown.h3>{heading}</Markdown.h3>
            <Markdown>{paragraph}</Markdown>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TilesSticky;
