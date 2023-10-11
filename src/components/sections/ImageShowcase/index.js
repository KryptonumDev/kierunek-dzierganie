'use client'
import { useRef } from 'react';
import Img from '@/utils/Img';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';
import Button from '@/components/atoms/Button';
import { motion, useScroll, useTransform } from 'framer-motion';

const ImageShowcase = ({
  data: {
    heading,
    paragraph,
    cta,
    cta_Annotation,
    images,
  }
}) => {
  const wrapper = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ['start end', 'end start']
  })

  const progress = useTransform(scrollYProgress, [0, 1], [50, -100]);
  const progressReversed = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section className={`${styles.wrapper}`} ref={wrapper}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta.href && (
          <>
            <Button data={cta} className={styles.cta} />
            {cta_Annotation && (
              <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>
            )}
          </>
        )}
        <div className={styles.images}>
          {images.map((item, i) => (
            <div key={i} className={styles.img}>
              <motion.div style={{ y: i % 2 ? progressReversed : progress }}>
                <Img data={item} />
              </motion.div>
            </div>
          ))}
        </div>
      </header>
    </section>
  );
};

export default ImageShowcase;