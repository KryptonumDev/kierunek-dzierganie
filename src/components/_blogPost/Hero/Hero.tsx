import { formatDateToPolishLocale } from '@/utils/formatDateToPolishLocale';
import styles from './Hero.module.scss';
import type { HeroTypes } from './Hero.types';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';

const Hero = ({ paragraph, img, heading, author, date }: HeroTypes) => {
  date = formatDateToPolishLocale(date);

  return (
    <section className={styles['Hero']}>
      <Img
        data={img}
        sizes=''
      />
      <div className={styles.content}>
        <div>
          <Markdown>{date}</Markdown>
          <Markdown.h3>{heading}</Markdown.h3>
          <Markdown>{paragraph}</Markdown>
        </div>
        <div className={styles.author}>
          <Img
            data={author.img}
            sizes='(max-width: 999px) 100vw, 50vw'
          />
          <div>
            <Markdown.h3>{author.heading}</Markdown.h3>
            <Markdown>{author.paragraph}</Markdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
