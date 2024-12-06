import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './TilesGallery.module.scss';
import type { Props } from './TilesGallery.types';

const TilesGallery = ({ heading, paragraph, cta, list }: Props) => {
  return (
    <section className={styles['TilesGallery']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
        <Button data={cta} />
      </header>
      <ul>
        {list.map(({ heading, paragraph, img }, i) => (
          <li key={i}>
            <div className={styles.image}>
              <Img
                data={img}
                sizes=''
              />
            </div>
            <Markdown.h3>{heading}</Markdown.h3>
            <Markdown>{paragraph}</Markdown>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TilesGallery;
