import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import GridImageShowcase from './_Grid';
import ParallaxImageShowcase from './_Parallax';
import styles from './ImageShowcase.module.scss';
import type { Props } from './ImageShowcase.types';

const ImageShowcase = ({ isGrid, heading, paragraph, cta, cta_Annotation, images }: Props) => {
  const data = {
    heading: <Markdown.h2>{heading}</Markdown.h2>,
    paragraph: <Markdown className={styles.paragraph}>{paragraph}</Markdown>,
    cta: (
      <Button
        data={cta}
        className={styles.cta}
      />
    ),
    ...(cta_Annotation && {
      cta_Annotation: <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>,
    }),
    images: images.map((image, i) => (
      <Img
        key={i}
        data={image}
        sizes={
          isGrid ? '(max-width: 749px) 50vw, (max-width: 989px) 33.3vw, 282px' :
            i === 0
              ? '(max-width: 768px) 28vw, 280px'
              : i === 1
                ? '(max-width: 768px) 12vw, 174px'
                : i === 2
                  ? '(max-width: 768px) 25vw, 278px'
                  : '(max-width: 768px) 12vw, 174px'
        }
      />
    )),
  };

  return isGrid ? <GridImageShowcase {...data} /> : <ParallaxImageShowcase {...data} />;
};

export default ImageShowcase;