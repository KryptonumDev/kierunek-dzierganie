import Img from '@/utils/image';
import Markdown from '@/utils/markdown';
import styles from './styles.module.scss';
import Button from '@/components/atoms/Button';
import type { CtaType, ImgType } from '@/global/types';

type Props = {
  heading: string;
  paragraph: string;
  cta: CtaType;
  cta_Annotation: string;
  img: ImgType;
  aboveTheFold: boolean;
};

const HeroBackgroundImg = ({ heading, paragraph, cta, cta_Annotation, img, aboveTheFold }: Props) => {
  return (
    <section className={`${styles.wrapper}`}>
      <Img
        data={img}
        className={styles.img}
        priority={aboveTheFold}
      />
      <header>
        <Markdown.h1>{heading}</Markdown.h1>
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

export default HeroBackgroundImg;