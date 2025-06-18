import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import styles from './Bonuses.module.scss';
import type { Props } from './Bonuses.types';

const Bonuses = ({ heading, list }: Props) => {
  return (
    <section className={styles.Bonuses}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      <div className={styles.list}>
        {list.map(({ description, img }, i) => (
          <div
            className={styles.item}
            key={i}
          >
            <Img
              data={img}
              className={styles.img}
              sizes={i === 0 ? '(max-width: 412px), 380px' : '(max-width: 599px) 156px, (max-width: 950px) 50vw, 380px'}
            />
            <div className={styles.description}>
              <Markdown>{description}</Markdown>
            </div>
          </div>
        ))}
      </div>
      <Decoration
        aria-hidden='true'
        className={styles.decoration}
      />
    </section>
  );
};

export default Bonuses;

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='108'
    height='133'
    fill='none'
    viewBox='0 0 108 133'
    {...props}
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M67.293 86.305c-3.745-6.39-7.996-21.163 4.962-29.142 3.179 4.998 6.636 17.822-4.962 29.142zm-6.818 19.233c2.612-4.594 10.225-12.491 19.778-7.33-1.954 3.746-8.646 10.458-19.778 7.33zM45.152 51.523c7.886-8.569 20.424-28.376 14.608-38.946-2.272-4.356-12.208-5.002-13.13 6.511m-1.996 33.088c-11.541 1.56-33.014-2.093-38.35-12.913-2.27-4.356 2.89-12.873 12.857-7.037'
    ></path>
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M33.425 12.17c-4.154 5.223 5.988 28.464 11.579 39.431 6.777-20.344.918-35.247-.648-38.252-1.567-3.004-5.738-7.707-10.93-1.178z'
    ></path>
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.4 27.158c3.006 9.284 20.324 20.417 28.606 24.823-8.059-21.322-17.368-30.872-21.016-32.983-2.98-1.724-10.596-1.123-7.59 8.16zm28.605 24.824c6.094 15.354 26.03 48.097 57.021 56.24'
    ></path>
  </svg>
);
