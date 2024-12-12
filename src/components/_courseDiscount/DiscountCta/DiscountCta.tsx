import Button from '@/components/ui/Button';
import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './DiscountCta.module.scss';
import type { DiscountCtaTypes } from './DiscountCta.types';

const DiscountCta = ({
  image,
  heading,
  paragraph,
  additionalParagraph,
  ctaText,
  additionalText,
  index,
}: DiscountCtaTypes) => {
  const HeadingComponent = index === 0 ? Markdown.h1 : Markdown.h2;
  return (
    <section className={styles['DiscountCta']}>
      <Img
        data={image}
        sizes=''
      />
      <header className={styles.header}>
        <HeadingComponent className={styles.heading}>{heading}</HeadingComponent>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {!!additionalParagraph && <Markdown className={styles.additionalParagraph}>{additionalParagraph}</Markdown>}
        <Button href={'/'}>{ctaText}</Button>
        {!!additionalText && <Markdown className={styles.additionalText}>{additionalText}</Markdown>}
      </header>
      <LeafIcon />
    </section>
  );
};

export default DiscountCta;

const LeafIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={133}
    height={113}
    fill='none'
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M59.226 43.237c5.1 9.892-8.488 22.345-15.92 27.335 1.82-12.687 4.908-22.454 6.225-25.752 3.764-6.595 8.032-3.803 9.695-1.583ZM48.018 68.976c7.153-1.022 22.424-1.823 26.281 3.154 1.296 1.538 2.985 5.342-.628 8.245-3.25 2.21-12.877 3.101-25.388-11.02M23.032 78.541c8.231-.632 25.701-.405 29.727 5.556 1.362 1.85 3.004 6.313-1.33 9.353-3.871 2.278-14.914 2.575-28.123-14.457M79.02 30.74c4.342 5.993-2.742 18.848-6.827 24.526-3.4-12.82-1.402-21.277.021-23.902 2.668-3.07 5.65-1.695 6.806-.623ZM102.484 45.737c-7.04-4.255-23 4.676-30.1 9.674 6.08 2.237 20.094 5.6 27.52 1.159 7.426-4.442 4.814-9.073 2.58-10.833ZM98.226 10.343c3.695 6.143-1.585 19.604-4.687 25.567-5.352-6.037-4.14-17.794-2.864-22.918 2.078-6.495 5.9-4.472 7.551-2.65Z'
    />
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M5.596 82.004C24.234 79.25 67.892 66.193 93.419 36m0 0c5.07-6.556 17.068-19.162 24.502-17.139 1.388.91 3.226 3.537-.533 6.768-4.808 4.24-16.333 12.252-23.97 10.37Z'
    />
  </svg>
);
