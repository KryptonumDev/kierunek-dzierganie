'use client';
import { useRef, useState } from 'react';
// import Link from 'next/link';
import styles from './Reviews.module.scss';
import 'swiper/css';
import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { SliderProps } from './Reviews.types';
import SliderControls from '@/components/ui/SliderControls';
import Card from './_Card';

const Slider = ({ list }: SliderProps) => {
  const listLength = list.length;
  const ref = useRef<SwiperRef | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const handlePrev = () => ref.current?.swiper.slidePrev();
  const handleNext = () => ref.current?.swiper.slideNext();
  const slideTo = (index: number) => ref.current?.swiper.slideTo(index);

  return (
    <>
      <Swiper
        ref={ref}
        className={styles.slider}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 1.3 },
          1024: { slidesPerView: 2 },
        }}
        modules={[A11y]}
        onSlideChange={(slider: { realIndex: number; isEnd: boolean }) =>
          setActiveIndex(slider.isEnd ? listLength - 1 : slider.realIndex)
        }
      >
        {list.map(({ rating, name, review, images }, i) => (
          <SwiperSlide
            key={i}
          > 
            <Card 
              rating={rating}
              name={name}
              review={review}
              images={images}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <SliderControls {...{ activeIndex, handlePrev, handleNext, slideTo, length: listLength }} />
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
