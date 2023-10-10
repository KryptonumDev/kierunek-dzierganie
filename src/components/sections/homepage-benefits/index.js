import Button from '@/components/atoms/Button';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const Benefits = ({
  data: {
    benefits_Heading,
    benefits_List,
    benefits_Paragraph,
    benefits_Cta,
    benefits_CtaAnnotation,
  }
}) => {
  return (
    <section className={styles.wrapper}>
      <Markdown.h2>{benefits_Heading}</Markdown.h2>
      <ul className={styles.list}>
        {benefits_List.map((item, i) => (
          <li key={i}>
            <Markdown>{item}</Markdown>
          </li>
        ))}
      </ul>
      <div className={styles.copy}>
        <Markdown className={styles.paragraph}>{benefits_Paragraph}</Markdown>
        <Button data={benefits_Cta} />
        <Markdown className={styles.ctaAnnotation}>{benefits_CtaAnnotation}</Markdown>
      </div>
      <Decoration aria-hidden="true" className={styles.decoration} />
    </section>
  );
};

export default Benefits;

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='108'
    height='133'
    viewBox='0 0 108 133'
    fill='none'
    {...props}
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M67.282 86.232c-3.745-6.39-7.996-21.163 4.962-29.14 3.178 4.997 6.636 17.821-4.962 29.14zm-6.822 19.234c2.612-4.594 10.225-12.491 19.778-7.33-1.954 3.746-8.646 10.458-19.778 7.33zM45.137 51.45c7.886-8.568 20.424-28.376 14.607-38.945-2.27-4.356-12.207-5.003-13.13 6.51m-1.997 33.089c-11.54 1.56-33.013-2.093-38.349-12.913-2.27-4.356 2.889-12.873 12.856-7.037'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M33.408 12.098c-4.155 5.223 5.988 28.464 11.578 39.431 6.778-20.345.919-35.248-.647-38.252C42.772 10.273 38.6 5.57 33.408 12.1z'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.387 27.086c3.006 9.284 20.323 20.416 28.606 24.822-8.06-21.321-17.369-30.872-21.016-32.982-2.98-1.725-10.596-1.124-7.59 8.16zM44.99 51.91c6.093 15.354 26.03 48.096 57.02 56.239'
    ></path>
  </svg>
)