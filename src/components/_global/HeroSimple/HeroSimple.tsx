import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import styles from './HeroSimple.module.scss';
import type { HeroSimpleTypes } from './HeroSimple.types';

const HeroSimple = ({ isHighlighted, heading, paragraph, cta }: HeroSimpleTypes) => {
  return (
    <section
      className={styles['HeroSimple']}
      data-highlighted={!!isHighlighted}
    >
      <header>
        <Markdown.h1>{heading}</Markdown.h1>
        {paragraph && <Markdown className={styles.paragraph}>{paragraph}</Markdown>}
        {cta && <Button data={cta} />}
      </header>
    </section>
  );
};

export default HeroSimple;
