'use client';
import { Fragment, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './Reviews.module.scss';
import 'swiper/css';
import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { SliderProps } from './Reviews.types';

const Slider = ({ list, LeftIcon, RightIcon, QuoteIcon, RatingIcon }: SliderProps) => {
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
            className={styles.item}
            key={i}
          >
            {QuoteIcon}
            <div className={styles.info}>
              <h3>{name}</h3>
              <div className={styles.rating}>
                {RatingIcon}
                <p>
                  <strong>{rating}</strong>/5
                </p>
              </div>
            </div>
            <p>{review}</p>
            {/* TODO: Add CTA to history of this person in Sanity and Next.js */}
            {images && (
              <div className={styles.images}>
                {images.map((img, i) => (
                  <Fragment key={i}>{img}</Fragment>
                ))}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.controls}>
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label='Przejdź do poprzedniego elementu'
          className={styles.button}
        >
          {LeftIcon}
        </button>
        {Array.from({ length: listLength }).map((_, i) => (
          <button
            key={i}
            aria-label={`Przejdź do ${i + 1} opinii`}
            className={styles.pagination}
            data-active={activeIndex === i}
            onClick={() => slideTo(i)}
          />
        ))}
        <button
          onClick={handleNext}
          disabled={activeIndex === listLength - 1}
          aria-label='Przejdź do następnego elementu'
          className={styles.button}
        >
          {RightIcon}
        </button>
      </div>
      <p className={styles.login}>
        <Link
          href='/moje-konto/autoryzacja'
          className='link'
        >
          Zaloguj się, aby dodać opinię
        </Link>
      </p>
    </>
  );
};

export default Slider;
