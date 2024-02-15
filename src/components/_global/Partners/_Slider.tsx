'use client';
import { useRef, useState } from 'react';
import styles from './Partners.module.scss';
import 'swiper/css';
import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { SliderProps } from './Partners.types';
import SliderControls from '@/components/ui/SliderControls';

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
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[A11y]}
        onSlideChange={(slider: { realIndex: number; isEnd: boolean }) =>
          setActiveIndex(slider.isEnd ? listLength - 1 : slider.realIndex)
        }
      >
        {list.map(({ img, name, description }, i) => (
          <SwiperSlide
            className={styles.item}
            key={i}
          >
            <>{img}</>
            <h3>{name}</h3>
            <p>{description}</p>
          </SwiperSlide>
        ))}
      </Swiper>
      <SliderControls {...{ activeIndex, handlePrev, handleNext, slideTo, length: listLength }} />
    </>
  );
};

export default Slider;
