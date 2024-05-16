'use client';
import useEmblaCarousel from 'embla-carousel-react';
import '@/global/embla.scss';
import styles from './Partners.module.scss';
import SliderControls from '@/components/ui/SliderControls';
import type { SliderProps } from './Partners.types';
import Link from 'next/link';

const Slider = ({ list }: SliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', skipSnaps: true });

  return (
    <div className={`embla ${styles.slider}`}>
      <div
        className='embla__viewport'
        ref={emblaRef}
      >
        <div className={'embla__container'}>
          {list.map(({ img, name, description, href }, i) => (
            <div
              key={i}
              className={`embla__slide ${styles.item}`}
            >
              {href ? (
                <Link
                  href={href}
                  className={styles.link}
                >
                  <>{img}</>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </Link>
              ) : (
                <>
                  <>{img}</>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <SliderControls api={emblaApi} />
    </div>
  );
};

export default Slider;
