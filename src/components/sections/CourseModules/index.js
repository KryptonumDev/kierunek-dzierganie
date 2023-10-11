import Img from '@/utils/Img';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const CourseModules = ({
  data: {
    heading,
    paragraph,
    list,
  }
}) => {
  return (
    <section className={`${styles.wrapper} sec-wo-margin`}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <div className={styles.list}>
        {list.map(({ title, description, img }, i) => (
          <div className={styles.item} key={i}>
            <Img data={img} className={styles.img} />
            <div>
              <Markdown className={styles.title}>{title}</Markdown>
              <Markdown className={styles.description}>{description}</Markdown>
            </div>
            {i < list.length-1 && (
              <Arrow className={styles.arrow} />
            )}
          </div>
        ))}
      </div>
      <Decoration1 aria-hidden="true" className={styles.decoration1} />
      <Decoration2 aria-hidden="true" className={styles.decoration2} />
    </section>
  );
};

export default CourseModules;

const Decoration1 = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='148'
    height='114'
    viewBox='0 0 148 114'
    { ...props }
    fill='none'
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      d='M97.417 51.187c-6.331 4.804-16.733 20.19-7.688 43.305M98.142 50.81c-4.037 6.682-9.99 23.774-1.5 38.673'
    ></path>
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      d='M97.987 50.738c.082 6.002 1.905 21.04 8.538 33.172m-8.616-33.752c6.447 5.792 19.731 21.32 21.295 37.102M97.99 50.374C92.296 37.836 69.545 11.591 24.077 6.916M132.015 82c-3.25-10.589-14.579-31.724-33.885-31.555'
    ></path>
    <circle
      cx='132'
      cy='84.24'
      r='3'
      fill='#B4A29C'
      transform='rotate(115.546 132 84.24)'
    ></circle>
    <circle
      cx='119.406'
      cy='90.672'
      r='3'
      fill='#B4A29C'
      transform='rotate(115.546 119.406 90.672)'
    ></circle>
    <circle
      cx='108.296'
      cy='86.024'
      r='3'
      fill='#B4A29C'
      transform='rotate(115.546 108.296 86.024)'
    ></circle>
    <circle
      cx='97.273'
      cy='90.862'
      r='3'
      fill='#B4A29C'
      transform='rotate(115.546 97.273 90.862)'
    ></circle>
    <circle
      cx='90.359'
      cy='95.981'
      r='3'
      fill='#B4A29C'
      transform='rotate(115.546 90.359 95.98)'
    ></circle>
  </svg>
)

const Decoration2 = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='109'
    height='109'
    viewBox='0 0 109 109'
    fill='none'
    { ...props }
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M62.513 57.157c-2.343-4.405-6.32-13.868-3.492-16.484 3.536-3.27 7.47 7.468 3.492 16.484zm1.859 2.121c-4.464-3.079-14.47-7.54-18.783-.751-4.313 6.788 10.725 3.33 18.783.751zM78.91 73.819c-3.315-4.582-8.91-14.814-4.773-19.092 4.136-4.278 4.905 10.945 4.772 19.092zm.358 1.06c-5.26-2.99-16.547-7.478-19.622-1.503-3.076 5.975 11.8 3.492 19.622 1.503zm9.677 11.269c-2.578-4.551-6.497-14.645-1.547-18.605 4.95-3.96 3.094 10.754 1.547 18.605zm.265.708c-4.374-2.52-14.132-5.79-18.163 1.281-4.03 7.071 10.43 2.092 18.164-1.281zM50.05 45.578c-4.625-1.267-14.336-2.316-16.175 3.624-1.838 5.94 10.018.059 16.175-3.624zm-.309-.574c-3.506-3.27-9.51-10.695-5.48-14.23 4.03-3.536 5.333 8.013 5.48 14.23zm-10.955-9.193c-5.656-1.09-17.05-1.794-17.368 4.11-.398 7.38 17.015-3.756 17.368-4.11z'
    ></path>
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M21.063 20.741c21.684 17.442 67.14 57.523 75.483 78.312M21.06 20.564c-2.975-.56-10.65-3.142-10.429-7.954.103-2.254 2.333-3.819 10.43 7.954z'
    ></path>
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M29.062 27.68c-3.462-1.37-11.685-3.06-16.882 1.149-6.496 5.259 11.447 5.877 16.882-1.15zm9.898 7.6c-3.564-3.564-9.271-11.87-3.58-16.572 5.693-4.702 4.76 9.09 3.58 16.573zm-9.454-7.866c-2.858-2.445-7.637-8.874-3.89-15.026 3.748-6.152 4.155 7.454 3.89 15.026z'
    ></path>
  </svg>
)

const Arrow = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='142'
    height='210'
    viewBox='0 0 142 210'
    fill='none'
    { ...props }
  >
    <path
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.29 169.997c-3.391 3.381-9.94 11.523-9.014 17.04M100.65 1.041c14.013 47.578 13.955 151.386-98.383 185.996 4.457 3.22 14.489 9.364 18.96 8.18'
    ></path>
  </svg>
)