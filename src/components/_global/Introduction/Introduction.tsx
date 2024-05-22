import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import styles from './Introduction.module.scss';
import type { Props } from './Introduction.types';

const Introduction = ({ isReversed, heading, paragraph, cta, img }: Props) => {
  return (
    <section
      className={`${styles['Introduction']} sec-wo-margin`}
      data-reversed={isReversed}
    >
      <Img
        data={img}
        sizes='(max-width: 499px) 80vw, 413px'
      />
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta && (
          <Button
            data={cta}
            className={styles.cta}
          />
        )}
      </header>
    </section>
  );
};

export default Introduction;