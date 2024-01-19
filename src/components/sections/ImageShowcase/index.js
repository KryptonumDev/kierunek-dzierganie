import GridImageShowcase from './grid';
import ParallaxImageShowcase from './parallax';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';
import Button from '@/components/atoms/Button';
import Img from '@/utils/Img';

const ImageShowcase = ({
  data: {
    isGrid,
    heading,
    paragraph,
    cta,
    cta_Annotation,
    images,
  }
}) => {
  const data = ({
    heading: <Markdown.h2>{heading}</Markdown.h2>,
    paragraph: <Markdown className={styles.paragraph}>{paragraph}</Markdown>,
    cta: <Button data={cta} className={styles.cta} />,
    cta_Annotation: <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>,
    images: images.map((image, i) => (
      <Img data={image} key={i} />
    ))
  })

  return isGrid ? (
    <GridImageShowcase {...data} />
  ) : (
    <ParallaxImageShowcase {...data} />
  )
}

export default ImageShowcase;