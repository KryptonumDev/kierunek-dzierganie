import { Fragment } from 'react';
import styles from './ImageShowcase.module.scss';
import type { GridImageShowcaseProps } from './ImageShowcase.types';

const GridImageShowcase = ({
  heading,
  paragraph,
  cta,
  cta_Annotation,
  images,
}: GridImageShowcaseProps) => {
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