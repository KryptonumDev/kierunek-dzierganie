'use client';
import useEmblaCarousel from 'embla-carousel-react';
import '@/global/embla.scss';
import styles from './Reviews.module.scss';
import SliderControls from '@/components/ui/SliderControls';
import Card from './_Card';
import type { SliderProps } from './Reviews.types';

const Slider = ({ list }: SliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', skipSnaps: true });

  return (
    <>
      <div className={`embla ${styles.slider}`}>
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {list.map(({ rating, name, review, images }, i) => (
              <div
                key={i}
                className={`embla__slide ${styles.slide}`}
              >
                <Card
                  rating={rating}
                  name={name}
                  review={review}
                  images={images}
                />
              </div>
            ))}
          </div>
        </div>
        <SliderControls api={emblaApi} />
      </div>
      {/* <p className={styles.login}>
        <Link
          href='/moje-konto/autoryzacja'
          className='link'
        >
          Zaloguj się, aby dodać opinię
        </Link>
      </p> */}
    </>
  );
};

export default Slider;
