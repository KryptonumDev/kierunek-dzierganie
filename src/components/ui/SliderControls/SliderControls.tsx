'use client';
import styles from './SliderControls.module.scss';
import type { Props } from './SliderControls.types';

const SliderControls = ({ handlePrev, activeIndex, length, slideTo, handleNext }: Props) => {
  return (
    <div className={styles['SliderControls']}>
      <button
        onClick={handlePrev}
        disabled={activeIndex === 0}
        aria-label='Przejdź do poprzedniego elementu'
        className={styles.button}
      >
        {LeftIcon}
      </button>
      <div>
        {Array.from({ length }).map((_, i) => (
          <button
            key={i}
            aria-label={`Przejdź do ${i + 1} elementu`}
            className={styles.pagination}
            data-active={activeIndex === i}
            onClick={() => slideTo(i)}
          />
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={activeIndex === length - 1}
        aria-label='Przejdź do następnego elementu'
        className={styles.button}
      >
        {RightIcon}
      </button>
    </div>
  );
};

export default SliderControls;

const LeftIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='23'
    height='9'
    fill='none'
    viewBox='0 0 23 9'
  >
    <path
      stroke='#53423C'
      strokeWidth='0.75'
      d='M22.906 4.858H1.094m0 0l3.75-3.75m-3.75 3.75l3.75 3.75'
    ></path>
  </svg>
);
const RightIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='23'
    height='9'
    fill='none'
    viewBox='0 0 23 9'
  >
    <path
      stroke='#53423C'
      strokeWidth='0.75'
      d='M.094 4.858h21.812m0 0l-3.75-3.75m3.75 3.75l-3.75 3.75'
    ></path>
  </svg>
);
