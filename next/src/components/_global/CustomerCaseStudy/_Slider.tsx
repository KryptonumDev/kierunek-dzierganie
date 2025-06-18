'use client';
import useEmblaCarousel from 'embla-carousel-react';
import '@/global/embla.scss';
import styles from './CustomerCaseStudy.module.scss';
import SliderControls from '@/components/ui/SliderControls';
import type { SliderProps } from './CustomerCaseStudy.types';

const Slider = ({ list }: SliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', skipSnaps: true });

  return (
    <div className={`embla ${styles.slider}`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {list.map(({ name, excerpt, img, cta }, i) => (
            <div
              key={i}
              className={`embla__slide ${styles.item}`}
            >
              <div className={styles.author}>
                <>{img}</>
                <p>{name}</p>
              </div>
              <p className={styles.excerpt}>{excerpt}</p>
              {cta}
            </div>
          ))}
        </div>
      </div>
      <SliderControls api={emblaApi} />
    </div>
  );
};

export default Slider;
