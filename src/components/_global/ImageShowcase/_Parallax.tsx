'use client';
import { useRef } from 'react';
import styles from './ImageShowcase.module.scss';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ParallaxImageShowcaseProps } from './ImageShowcase.types';

const ParallaxImageShowcase = ({
  heading,
  paragraph,
  cta,
  cta_Annotation,
  images,
}: ParallaxImageShowcaseProps) => {
  const wrapper = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ['start end', 'end start']
  });
  const progress1 = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const progress2 = useTransform(scrollYProgress, [0, 1], [80, -160]);

  return (
    <section className={`${styles.ParallaxImageShowcase}`} ref={wrapper}>
      <header>
        {heading}
        {paragraph}
        {cta}
        {cta_Annotation && cta_Annotation}
      </header>
      <div className={styles.images}>
        {images.map((img, i) => (
          <div key={i} className={styles.img}>
            <motion.div style={{ y: i % 2 ? progress2 : progress1 }}>
              {img}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ParallaxImageShowcase;