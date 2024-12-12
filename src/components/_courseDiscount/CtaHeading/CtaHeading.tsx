import Button from '@/components/ui/Button';
import Markdown from '@/components/ui/markdown';
import styles from './CtaHeading.module.scss';
import type { CtaHeadingTypes } from './CtaHeading.types';

const CtaHeading = ({ heading, paragraph, ctaText, additionalText, index }: CtaHeadingTypes) => {
  const HeadingComponent = index === 0 ? Markdown.h1 : Markdown.h2;

  return (
    <section className={styles['CtaHeading']}>
      <HeadingComponent className={styles.heading}>{heading}</HeadingComponent>
      <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      <Button href={'/'}>{ctaText}</Button>
      {!!additionalText && <Markdown className={styles.additionalText}>{additionalText}</Markdown>}
      <FlowerIcon />
    </section>
  );
};

export default CtaHeading;

const FlowerIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={108}
    height={134}
    fill='none'
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M67.293 86.768c-3.745-6.39-7.996-21.163 4.962-29.141 3.179 4.997 6.636 17.822-4.962 29.141ZM60.475 106.001c2.612-4.593 10.225-12.49 19.778-7.33-1.954 3.747-8.646 10.459-19.778 7.33ZM45.152 51.986C53.038 43.417 65.576 23.61 59.76 13.04c-2.272-4.356-12.208-5.002-13.13 6.511M44.634 52.64c-11.541 1.559-33.014-2.093-38.35-12.914-2.27-4.356 2.89-12.872 12.857-7.036'
    />
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M33.425 12.634c-4.154 5.223 5.988 28.463 11.579 39.43 6.777-20.344.918-35.247-.648-38.251-1.567-3.005-5.738-7.707-10.93-1.179Z'
    />
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.4 27.622c3.006 9.283 20.324 20.416 28.606 24.822-8.059-21.321-17.368-30.872-21.016-32.982-2.98-1.725-10.596-1.124-7.59 8.16ZM45.005 52.446c6.094 15.353 26.03 48.096 57.021 56.239'
    />
  </svg>
);
