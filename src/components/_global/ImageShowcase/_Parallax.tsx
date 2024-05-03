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
  const progress1 = useTransform(scrollYProgress, [0, 1], [50, -100]);
  const progress2 = useTransform(scrollYProgress, [0, 1], [100, -200]);

  return (
    <section className={`${styles.ParallaxImageShowcase}`} ref={wrapper}>
      <header>
        {heading}
        {paragraph}
        {cta}
        {cta_Annotation && cta_Annotation}
        <div className={styles.images}>
          {images.map((img, i) => (
            <div key={i} className={styles.img}>
              <motion.div style={{ y: i % 2 ? progress2 : progress1 }}>
                {img}
              </motion.div>
            </div>
          ))}
        </div>
      </header>
    </section>
  );
};

export default ParallaxImageShowcase;