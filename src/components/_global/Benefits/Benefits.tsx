import styles from './Benefits.module.scss';
import Markdown from '@/components/ui/markdown';
import Button from '@/components/ui/Button';
import Item from './_Item';
import type { Props } from './Benefits.types';

const Benefits = ({ benefits, claim, cta, cta_Annotation }: Props) => {
  return (
    <section className={`${styles.Benefits}`}>
      <ul className={styles.benefits}>
        {benefits.map((item, i) => (
          <Item key={i}>
            <Markdown>{item}</Markdown>
          </Item>
        ))}
      </ul>
      <p className={styles.claim}>{claim}</p>
      {cta.href && (
        <>
          <Button
            data={cta}
            className={styles.cta}
          />
          {cta_Annotation && <Markdown className={styles.ctaAnnotation}>{cta_Annotation}</Markdown>}
        </>
      )}
      <Decoration
        aria-hidden='true'
        className={styles.decoration}
      />
    </section>
  );
};

export default Benefits;

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='128'
    height='139'
    viewBox='0 0 128 139'
    fill='none'
    {...props}
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M71.272 86.814c-.876.367-3.336 1.84-6.162 4.802m-10.261 14.492c1.074-10.092 7.287-13.866 10.26-14.492 4.916 6.31-5.553 13.517-8.067 15.476-2.011 1.568-2.3-.003-2.194-.984zM92.78 73.941c-5.419 7.201-2.916 14.765-.988 17.646 7.715-3.317 3.922-15.812 2.731-17.34-.953-1.223-1.56-.714-1.743-.306zM40.547 84.293c8.54-3.358 14.983-.16 17.138 1.86-9.516 7.413-14.449 1.59-17.065.063-2.092-1.221-.92-1.791-.073-1.923zm-18.89-33.696c8.951-3.805 17.237-.86 20.261 1.09-7.337 9.599-18.47 2.428-21.015 1.4-2.036-.823-.345-2.003.754-2.49zM34.8 20.788c-3.016 10.527 2.236 19.783 5.24 23.095 4.502-9.372-1.203-21.17-2.949-23.613-1.396-1.954-2.109-.47-2.29.518zm-16.349 2.914c4.842 10.932 10.983 14.366 13.448 14.717.563-8.124-7.889-13.582-10.916-15.026-2.422-1.156-2.697-.276-2.532.309zm48.817 2.451c-5.596 8.925-2.868 17.606-.804 20.83 8.344-5.866 3.815-13.51 3.07-17.921-.595-3.53-1.758-3.41-2.266-2.91zm11.929 19.783c-7.933 4.787-10.618 14.032-10.969 18.056 13.62-7.84 12.594-15.36 13.491-17.564.718-1.764-1.382-1.063-2.522-.492z'
    ></path>
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      d='M93.84 108.765c-.11-3.19-.675-11.075-2.066-17.09M41.883 51.637c1.853.141 6.939 1.503 12.46 5.822m3.376 28.742c5.243-.388 17.253-.227 23.344 3.52M31.86 38.37c11.444 6.823 41.386 33.103 69.602 83.632M71.257 76.603c-1.98-7.014-5.721-22.798-4.85-29.815'
    ></path>
  </svg>
);