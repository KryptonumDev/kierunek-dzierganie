import { Fragment } from "react";

const GridImageShowcase = ({
  heading,
  paragraph,
  cta,
  cta_Annotation,
  images,
}) => {
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
        {cta.href && (
          <>
            {cta}
            {cta_Annotation && (
              {cta_Annotation}
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default GridImageShowcase;