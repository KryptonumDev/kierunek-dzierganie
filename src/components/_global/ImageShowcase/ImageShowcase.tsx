import GridImageShowcase from './ImageShowcase_Grid';
import ParallaxImageShowcase from './ImageShowcase_Parallax';
import Markdown from '@/components/ui/markdown';
import styles from './ImageShowcase.module.scss';
import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
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
          i === 0
            ? '(max-width: 768px) 28vw, 280px'
            : i === 1
              ? '(max-width: 768px) 12vw, 174px'
              : i === 2
                ? '(max-width: 768px) 25vw, 278px'
                : i === 3
                  ? '(max-width: 768px) 12vw, 174px'
                  : i === 4
                    ? '(max-width: 768px) 28vw, 280px'
                    : i === 5
                      ? '(max-width: 768px) 12vw, 174px'
                      : i === 6
                        ? '(max-width: 768px) 12vw, 174px'
                        : i === 7
                          ? '(max-width: 768px) 12vw, 174px'
                          : i === 8
                            ? '(max-width: 768px) 25vw, 280px'
                            : '(max-width: 768px) 28vw, 280px'
        }
      />
    )),
  };

  return isGrid ? <GridImageShowcase {...data} /> : <ParallaxImageShowcase {...data} />;
};

export default ImageShowcase;