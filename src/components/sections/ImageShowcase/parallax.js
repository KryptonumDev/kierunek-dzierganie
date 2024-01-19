'use client'
import { useRef } from 'react';
import styles from './styles.module.scss';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxImageShowcase = ({
  heading,
  paragraph,
  cta,
  cta_Annotation,
  images,
}) => {
  const wrapper = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ['start end', 'end start']
  })
  const progress = useTransform(scrollYProgress, [0, 1], [50, -150]);
  const progressReversed = useTransform(scrollYProgress, [0, 1], [-50, 100]);

  return (
    <section className={`${styles.ParallaxImageShowcase}`} ref={wrapper}>
      <header>
        {heading}
        {paragraph}
        {cta.href && (
          <>
            {cta}
            {cta_Annotation && (
              {cta_Annotation}
            )}
          </>
        )}
        <div className={styles.images}>
          {images.map((img, i) => (
            <div key={i} className={styles.img}>
              <motion.div style={{ y: i % 2 ? progressReversed : progress }}>
                {img}
              </motion.div>
            </div>
          ))}
        </div>
      </header>
    </section>
  )
}

export default ParallaxImageShowcase;