import Markdown from '@/utils/markdown';
import styles from './styles.module.scss';
import Button from '@/components/atoms/Button';
import type { CtaType } from '@/global/types';

type Props = {
  heading: string;
  paragraph: string;
  cta: CtaType
  cta_Annotation?: string;
};

const SimpleCtaSection = ({
  heading,
  paragraph,
  cta,
  cta_Annotation
}: Props) => {
  return (
    <section className={`${styles.wrapper}`}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta.href && (
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