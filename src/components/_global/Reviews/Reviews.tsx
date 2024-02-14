import Markdown from '@/components/ui/markdown';
import styles from './Reviews.module.scss';
import type { Props } from './Reviews.types';
import Img from '@/components/ui/image';
import Slider from './_Slider';

const Reviews = ({ heading, list }: Props) => {
  const renderedList = list.map(({ images, ...props }) => ({
    images: images?.map((img, i) => <Img data={img} key={i} sizes='(max-width: 649px) 50vw, 252px' />) as React.ReactNode[],
    ...props,
  }));

  return (
    <section className={styles['Reviews']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      <Slider list={renderedList} QuoteIcon={QuoteIcon} RatingIcon={RatingIcon} />
    </section>
  );
};

export default Reviews;

const QuoteIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='40'
    height='42'
    fill='none'
    viewBox='0 0 40 42'
    className={styles.quote}
  >
    <path
      fill='#EFE8E7'
      d='M15.594 1.926c2.557 1.885 3.461 4.81 3.208 8.29-6.752 3.381-12.882 4.135-11.52-3.353 1.2-6.6 6.477-6.6 8.312-4.937zm18.875 0c2.449 1.805 3.424 4.41 3.339 7.473-3.856 4.202-12.98 4.775-11.652-2.536 1.2-6.6 6.478-6.6 8.313-4.937z'
    ></path>
    <path
      stroke='#EFE8E7'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M1.375 40.858c7.767-8.009 16.748-21.32 17.427-30.642m0 0c.253-3.48-.65-6.405-3.208-8.29C13.759.263 8.48.263 7.28 6.863c-1.361 7.488 4.769 6.734 11.52 3.353zm0 0a45.95 45.95 0 002.073-1.108m0 29.5c7.89-8.135 16.69-20.511 16.933-29.21m0 0c.085-3.061-.89-5.667-3.34-7.472C32.635.263 27.357.263 26.157 6.863c-1.329 7.31 7.796 6.738 11.652 2.536zm0 0A6.621 6.621 0 0039 7.608'
    ></path>
  </svg>
);
const RatingIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='25'
    height='22'
    fill='none'
    viewBox='0 0 25 22'
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.378 19.064c2.61-.846 10.89-7.364 10.615-13.27-.294-6.362-5.856-5.22-8.384-2.87-3.09 2.87-5.359 8.365-3.457 9.047 2.353.845 2.465-1.36 1.986-2.794C13.55 7.411 8.684-1.92 3.107 1.676c-6.43 4.145 3.521 13.42 7.689 18.813.56.725 1.297.885 1.356 0'
    ></path>
  </svg>
);