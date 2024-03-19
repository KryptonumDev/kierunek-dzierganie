import Markdown from '@/components/ui/markdown';
import styles from './HeroBackground.module.scss';
import type { HeroBackgroundTypes } from './HeroBackground.types';

const HeroBackground = ({ data: { hero_Heading, hero_Paragraph } }: HeroBackgroundTypes) => {
  return (
    <section className={styles['HeroBackground']}>
      <div className={styles.wrapper}>
        <Markdown.h2>{hero_Heading}</Markdown.h2>
        <Markdown>{hero_Paragraph}</Markdown>
      </div>
    </section>
  );
};

export default HeroBackground;
