'use client';
import { useRef, useState } from 'react';
import styles from './CustomerCaseStudy.module.scss';
import 'swiper/css';
import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { SliderProps } from './CustomerCaseStudy.types';
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
        {list.map(({ name, excerpt, img, cta }, i) => (
          <SwiperSlide
            className={styles.item}
            key={i}
          >
            <div className={styles.author}>
              <>{img}</>
              <p>{name}</p>
            </div>
            <p className={styles.excerpt}>{excerpt}</p>
            {cta}
          </SwiperSlide>
        ))}
      </Swiper>
      <SliderControls {...{ activeIndex, handlePrev, handleNext, slideTo, length: listLength }} />
    </>
  );
};

export default Slider;
