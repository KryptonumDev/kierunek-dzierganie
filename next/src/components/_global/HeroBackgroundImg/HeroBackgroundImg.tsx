import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './HeroBackgroundImg.module.scss';
import Button from '@/components/ui/Button';
import type { Props } from './HeroBackgroundImg.types';

const HeroBackgroundImg = ({ isReversed, heading, paragraph, cta, cta_Annotation, img, aboveTheFold }: Props) => {
  return (
    <section
      className={`${styles.HeroBackgroundImg}`}
      data-reversed={isReversed}
    >
      <Img
        data={img}
        className={styles.img}
        priority={aboveTheFold}
        sizes='100vw'
      />
      <header>
        <Markdown.h1>{heading}</Markdown.h1>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta && (
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

export default HeroBackgroundImg;
