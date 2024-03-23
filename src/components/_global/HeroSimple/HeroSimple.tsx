import Markdown from '@/components/ui/markdown';
import styles from './HeroSimple.module.scss';
import type { HeroSimpleTypes } from './HeroSimple.types';

const HeroSimple = ({ isHighlighted, heading, paragraph }: HeroSimpleTypes) => {
  return (
    <section
      className={styles['HeroSimple']}
      data-highlighted={!!isHighlighted}
    >
      <header>
        <Markdown.h1>{heading}</Markdown.h1>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
    </section>
  );
};

export default HeroSimple;
