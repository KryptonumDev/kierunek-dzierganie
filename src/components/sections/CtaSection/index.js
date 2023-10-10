import Img from '@/utils/Img';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';
import Button from '@/components/atoms/Button';

const CtaSection = ({
  data: {
    isReversed,
    heading,
    paragraph,
    cta,
    cta_Annotation,
    img,
  }
}) => {
  return (
    <section
      className={`${styles.wrapper}`}
      data-reversed={Boolean(isReversed)}
    >
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        {cta.href && (
          <Button data={cta} className={styles.cta} />
        )}
        {cta_Annotation && (
          <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>
        )}
      </header>
      <Img data={img} className={styles.img} />
      <Decoration aria-hidden="true" className={styles.decoration} />
    </section>
  );
};

export default CtaSection;

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='134'
    height='113'
    viewBox='0 0 134 113'
    fill='none'
    {...props}
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M59.828 43.06c5.1 9.89-8.489 22.344-15.92 27.334 1.819-12.687 4.907-22.455 6.224-25.752 3.765-6.595 8.032-3.803 9.696-1.583zM48.62 68.798c7.153-1.022 22.424-1.823 26.281 3.153 1.296 1.54 2.984 5.343-.628 8.246-3.25 2.21-12.878 3.101-25.388-11.02m-25.252 9.186c8.232-.632 25.702-.406 29.728 5.555 1.362 1.851 3.004 6.313-1.331 9.353-3.87 2.278-14.913 2.576-28.123-14.456m55.715-48.252c4.341 5.991-2.743 18.846-6.827 24.525-3.4-12.82-1.403-21.277.021-23.903 2.668-3.07 5.649-1.694 6.806-.622zm23.463 14.996c-7.039-4.255-22.999 4.676-30.1 9.674 6.08 2.237 20.094 5.6 27.52 1.159 7.427-4.442 4.814-9.073 2.58-10.833zm-4.257-35.394c3.695 6.143-1.585 19.604-4.687 25.567-5.352-6.037-4.14-17.795-2.865-22.919 2.078-6.494 5.9-4.471 7.552-2.648z'
    ></path>
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6.197 81.826C24.835 79.072 68.493 66.015 94.02 35.82m0 0c5.07-6.555 17.068-19.16 24.502-17.138 1.389.91 3.227 3.537-.532 6.768-4.808 4.24-16.334 12.252-23.97 10.37z'
    ></path>
  </svg>
)