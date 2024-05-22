import Button from '@/components/ui/Button';
import Markdown from '@/components/ui/markdown';
import styles from './Opinions.module.scss';
import type { Props } from './Opinions.types';

const Opinions = ({ heading, list, paragraph, cta, cta_Annotation }: Props) => {
  return (
    <section className={styles.Opinions}>
      <Markdown.h2>{heading}</Markdown.h2>
      <ul className={styles.opinions}>
        {list.map(({ author, description }, i) => (
          <li key={i}>
            <Quote
              aria-hidden='true'
              className={styles.quote}
            />
            <Markdown className={styles.description}>{description}</Markdown>
            <p className={styles.author}>{author}</p>
          </li>
        ))}
      </ul>
      <div className={styles.copy}>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        <Button data={cta} className={styles.cta} />
        <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>
      </div>
      <Decoration
        aria-hidden='true'
        className={styles.decoration}
      />
    </section>
  );
};

export default Opinions;

const Quote = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='33'
    height='35'
    viewBox='0 0 33 35'
    fill='none'
    {...props}
  >
    <path
      fill='#EFE8E7'
      d='M12.948 1.808c2.082 1.534 2.818 3.915 2.612 6.748-5.496 2.752-10.486 3.366-9.378-2.73C7.16.455 11.455.455 12.948 1.809z'
    ></path>
    <path
      stroke='#EFE8E7'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M1.375 33.497c8.682-8.953 19.23-26.046 11.573-31.69C11.455.455 7.16.455 6.182 5.828c-1.22 6.715 4.96 5.287 11.065 1.827'
    ></path>
    <path
      fill='#EFE8E7'
      d='M28.312 1.808c1.993 1.47 2.787 3.59 2.718 6.083-3.139 3.42-10.566 3.886-9.484-2.064.977-5.373 5.272-5.373 6.766-4.02z'
    ></path>
    <path
      stroke='#EFE8E7'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M17.247 31.666C25.93 22.712 35.968 7.45 28.312 1.808 26.818.454 22.522.454 21.546 5.827c-1.221 6.715 8.394 5.258 10.454.606'
    ></path>
  </svg>
);

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='148'
    height='115'
    viewBox='0 0 148 115'
    fill='none'
    {...props}
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      d='M50.4 63.514c6.376-4.746 16.917-20.037 8.084-43.233M49.675 63.885c4.098-6.646 10.206-23.683 1.852-38.659'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      d='M49.821 63.956c-.027-6.003-1.713-21.056-8.235-33.249M49.9 64.538c-6.395-5.85-19.538-21.5-20.958-37.294M49.824 64.32c5.578 12.59 28.088 39.041 73.512 44.13M16.082 32.386c3.154 10.618 14.29 31.855 33.596 31.863'
    ></path>
    <circle
      cx='15.555'
      cy='30.495'
      r='2.771'
      fill='#9A827A'
      transform='rotate(-63.931 15.555 30.495)'
    ></circle>
    <circle
      cx='28.552'
      cy='24.331'
      r='2.771'
      fill='#9A827A'
      transform='rotate(-63.931 28.552 24.331)'
    ></circle>
    <circle
      cx='39.816'
      cy='28.39'
      r='2.771'
      fill='#9A827A'
      transform='rotate(-63.931 39.816 28.39)'
    ></circle>
    <circle
      cx='50.418'
      cy='23.413'
      r='2.771'
      fill='#9A827A'
      transform='rotate(-63.931 50.418 23.413)'
    ></circle>
    <circle
      cx='57.814'
      cy='18.683'
      r='2.771'
      fill='#9A827A'
      transform='rotate(-63.931 57.814 18.683)'
    ></circle>
  </svg>
);
