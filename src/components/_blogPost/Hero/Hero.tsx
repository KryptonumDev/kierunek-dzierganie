import { formatDateToPolishLocale } from '@/utils/formatDateToPolishLocale';
import styles from './Hero.module.scss';
import type { HeroTypes } from './Hero.types';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import ReadingTime from '@/components/ui/ReadingTime';

const Hero = ({ paragraph, img, heading, author, date, portableText }: HeroTypes) => {
  date = formatDateToPolishLocale(date);
  return (
    <section className={styles['Hero']}>
      <div className={styles.imageWrapper}>
        <Img
          data={img}
          sizes='(max-width: 999px) 100vw, 50vw'
        />
        <ReadingTime portableText={portableText} />
      </div>
      <div className={styles.content}>
        <div>
          <Markdown>{date}</Markdown>
          <Markdown.h3>{heading}</Markdown.h3>
          <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        </div>
        <div className={styles.author}>
          <Img
            data={author.img}
            sizes='100px'
          />
          <div>
            <Markdown.h3>{'**Autor publikacji**'}</Markdown.h3>
            <Markdown>{author.paragraph}</Markdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
