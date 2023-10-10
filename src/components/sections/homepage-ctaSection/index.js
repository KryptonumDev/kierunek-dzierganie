import Button from '@/components/atoms/Button';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const CtaSection = ({
  data: {
    ctaSection_Heading,
    ctaSection_Paragraph,
    ctaSection_Cta,
    ctaSection_CtaAnnotation
  }
}) => {
  return (
    <section className={styles.wrapper}>
      <header>
        <Markdown.h2>{ctaSection_Heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{ctaSection_Paragraph}</Markdown>
        <Button data={ctaSection_Cta} />
        <Markdown className={styles.ctaAnnotation}>{ctaSection_CtaAnnotation}</Markdown>
      </header>
      <Decoration aria-hidden="true" className={styles.decoration} />
    </section>
  );
};

export default CtaSection;

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='124'
    height='130'
    viewBox='0 0 124 130'
    fill='none'
    {...props}
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M71.417 48.42c-7.907 7.956-2.232 23.973 1.594 30.987 6.528-11.966 7.712-22.492 7.488-26.26-1.2-9.745-6.555-7.212-9.082-4.728zM34.566 68.059c9.273-5.337 28.359 4.746 36.743 10.454-8.879 1.436-28.336 3.327-35.141-.595-6.805-3.922-3.904-8.207-1.602-9.859zm53.69-5.905c-7.776 10.004.276 25.82 5.275 32.476 6.877-18.17 5.913-27.813 4.571-30.363-3.496-7.121-8.02-4.376-9.846-2.113zM65.311 97.563c5.252-6.173 20.836-4.19 27.971-2.426-16.065 10.42-23.831 10.961-25.706 9.93-4.39-2.058-3.339-5.86-2.265-7.504zM59.86 31.55c-8.568 3.76-7.167 18.654-5.396 25.63 6.197-3.91 9.787-11.212 11.374-18.845.822-3.953-2.554-7.866-5.978-6.786zM25.47 41.618c7.582-4.097 21.942 8.862 28.174 15.854-13.077-.186-21.469-2.463-24.03-3.578-9.837-5.107-6.861-10.312-4.144-12.276zM34.383 9.23c-7.966 2.929 3.975 26.414 11.26 31.833 1.901-5.464 3.012-15.538-.16-24.61-1.842-5.265-6.246-9.008-11.1-7.223z'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      d='M109.797 103.127c-14.65-4.74-47.992-23.789-64.154-62.064'
    ></path>
  </svg>
)