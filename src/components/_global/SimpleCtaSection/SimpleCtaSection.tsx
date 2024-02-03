import Markdown from '@/components/ui/markdown';
import styles from './SimpleCtaSection.module.scss';
import Button from '@/components/ui/Button';
import type { Props } from './SimpleCtaSection.types';

const SimpleCtaSection = ({ heading, paragraph, cta, cta_Annotation }: Props) => {
  return (
    <section className={`${styles.SimpleCtaSection}`}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        {paragraph && (
          <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        )}
        {cta?.href && (
          <>
            <Button
              data={cta}
              className={styles.cta}
            />
            {cta_Annotation && <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>}
          </>
        )}
      </header>
    </section>
  );
};

export default SimpleCtaSection;