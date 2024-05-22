'use client';
import { useCallback, useEffect, useState } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

const useNavigation = (emblaApi: EmblaCarouselType | undefined) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

const usePagination = (emblaApi: EmblaCarouselType | undefined) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export default function SliderControls({ api }: { api: EmblaCarouselType | undefined }) {
  const { selectedIndex, scrollSnaps, onDotButtonClick } = usePagination(api);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = useNavigation(api);

  return (
    <>
      {scrollSnaps.length > 1 && (
        <>
          <div className='embla__controls'>
            <button
              className='embla__button embla__button--prev'
              type='button'
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              aria-label='Przejdź do poprzedniego elementu'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={23}
                height={9}
                viewBox='0 0 23 9'
                fill='none'
              >
                <path
                  d='M22.906 4.767H1.094m0 0 3.75-3.75m-3.75 3.75 3.75 3.75'
                  stroke='#53423C'
                  strokeWidth={0.75}
                />
              </svg>
            </button>
            <div className='embla__dots'>
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  type='button'
                  className='embla__dot'
                  onClick={() => onDotButtonClick(index)}
                  aria-current={index === selectedIndex}
                  aria-label={`Przejdź do ${index + 1} elementu`}
                />
              ))}
            </div>
            <button
              className='embla__button embla__button--next'
              type='button'
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              aria-label='Przejdź do następnego elementu'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={23}
                height={9}
                viewBox='0 0 23 9'
                fill='none'
              >
                <path
                  d='M.094 4.767h21.812m0 0-3.75-3.75m3.75 3.75-3.75 3.75'
                  stroke='#53423C'
                  strokeWidth={0.75}
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </>
  );
}
