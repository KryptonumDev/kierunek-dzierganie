import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import styles from './TilesFeatures.module.scss';
import type { Props } from './TilesFeatures.types';
import { TilesItem } from './_TilesItem';

const TilesFeatures = ({ heading, paragraph, list }: Props) => {
  return (
    <section className={styles['TilesFeatures']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        {paragraph && (
          <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        )}
      </header>
      <div className={styles.tiles}>
        {list.map(({ img, heading, paragraph }, i) => (
          <TilesItem className={styles.item} key={i}>
            <Img data={img} sizes='274px' />
            <div>
              <Markdown.h3>{heading}</Markdown.h3>
              <Markdown>{paragraph}</Markdown>
            </div>
          </TilesItem>
        ))}
      </div>
    </section>
  );
};

export default TilesFeatures;