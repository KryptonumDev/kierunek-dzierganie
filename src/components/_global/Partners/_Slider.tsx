'use client';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './Partners.module.scss';
import '@/global/embla.scss';
import SliderControls from '@/components/ui/SliderControls';
import type { SliderProps } from './Partners.types';

const Slider = ({ list }: SliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', skipSnaps: true });

  return (
    <div className={`embla ${styles.slider}`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {list.map(({ img, name, description }, i) => (
            <div
              key={i}
              className={`embla__slide ${styles.item}`}
            >
              <>{img}</>
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
      <SliderControls api={emblaApi} />
    </div>
  );
};

export default Slider;
