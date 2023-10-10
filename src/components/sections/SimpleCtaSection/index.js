import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';
import Button from '@/components/atoms/Button';

const SimpleCtaSection = ({
  data: {
    heading,
    paragraph,
    cta,
    cta_Annotation,
  }
}) => {
  return (
    <section className={`${styles.wrapper}`}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta.href && (
          <>
            <Button data={cta} className={styles.cta} />
            {cta_Annotation && (
              <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>
            )}
          </>
        )}
      </header>
    </section>
  );
};

export default SimpleCtaSection;