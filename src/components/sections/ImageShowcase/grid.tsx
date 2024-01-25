import { Fragment } from 'react';
import styles from './styles.module.scss';

type Props = {
  heading: React.ReactNode,
  paragraph: React.ReactNode,
  cta: React.ReactNode,
  cta_Annotation?: React.ReactNode,
  images: React.ReactNode[]
};

const GridImageShowcase = ({
  heading,
  paragraph,
  cta,
  cta_Annotation,
  images,
}: Props) => {
  return (
    <section className={styles.GridImageShowcase}>
      {heading}
      <div className={styles.images}>
        {images.map((img, i) => (
          <Fragment key={i}>
            {img}
          </Fragment>
        ))}
      </div>
      <div className={styles.copy}>
        {paragraph}
        {cta}
        {cta_Annotation && cta_Annotation}
      </div>
    </section>
  );
};

export default GridImageShowcase;