import Img from '@/utils/Img';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';
import Button from '@/components/atoms/Button';

const HeroBackgroundImg = ({
  data: {
    heading,
    paragraph,
    cta,
    cta_Annotation,
    img,
  }
}) => {
  return (
    <section
      className={`${styles.wrapper}`}
    >
      <Img data={img} className={styles.img} priority={true} />
      <header>
        <Markdown.h1>{heading}</Markdown.h1>
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

export default HeroBackgroundImg;