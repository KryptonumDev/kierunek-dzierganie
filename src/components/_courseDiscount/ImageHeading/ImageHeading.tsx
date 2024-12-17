import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './ImageHeading.module.scss';
import type { ImageHeadingTypes } from './ImageHeading.types';
import Timer from './_Timer';

const ImageHeading = ({ image, heading, paragraph, index, expirationDate }: ImageHeadingTypes) => {
  const HeadingComponent = index === 0 ? Markdown.h1 : Markdown.h2;
  return (
    <section className={styles['ImageHeading']}>
      <header className={styles.header}>
        <HeartIcon />
        <HeadingComponent className={styles.heading}>{heading}</HeadingComponent>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <div className={styles.image}>
        <Timer expirationDate={expirationDate} />
        <Img
          data={image}
          sizes=''
        />
      </div>
      <LeafIcon />
    </section>
  );
};

export default ImageHeading;

const HeartIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 114 88'
    fill='none'
  >
    <path
      fill='#B4A29C'
      d='M33.313 70.964a.5.5 0 0 0 .348-.938l-.348.938ZM6.892 4.287l.267.423-.267-.423Zm32.435 22.056.474-.158-.474.158Zm-5.84 8.215-.17.47.17-.47Zm10.163-26.6-.34-.367.34.366Zm24.653 8.438.498.035.002-.03-.001-.028-.5.023ZM46.936 57.392l-.169-.471.169.47Zm10.373 6.792-.457.202.01.024.014.023.434-.25Zm24.024 9.041-.165-.472.165.472Zm31.583 2.677a.5.5 0 0 0 .168-.986l-.168.986Zm-79.255-5.876c-3.555-1.316-8.159-5.308-12.798-10.837-4.62-5.508-9.218-12.47-12.773-19.63-3.56-7.168-6.057-14.496-6.514-20.74C1.118 12.576 2.7 7.528 7.159 4.71l-.534-.844C1.723 6.962.107 12.465.578 18.892c.471 6.426 3.029 13.887 6.616 21.11 3.59 7.231 8.23 14.26 12.903 19.83 4.655 5.548 9.4 9.719 13.216 11.132l.348-.938ZM7.159 4.71C10.66 2.497 13.85 1.65 16.73 1.747c2.883.095 5.5 1.134 7.855 2.76 4.728 3.263 8.343 8.857 10.792 13.722l.893-.45c-2.47-4.908-6.178-10.686-11.116-14.095-2.478-1.71-5.278-2.833-8.39-2.937-3.115-.103-6.5.816-10.14 3.118l.534.845Zm28.22 13.519c1.842 3.659 3.005 6.866 3.474 8.272l.948-.316c-.48-1.438-1.66-4.692-3.53-8.406l-.893.45Zm3.474 8.272c.687 2.059.917 4.593.215 6.267-.341.814-.89 1.401-1.709 1.672-.836.276-2.031.248-3.703-.352l-.338.94c1.787.642 3.228.734 4.355.361 1.145-.378 1.887-1.21 2.317-2.234.84-2 .53-4.815-.189-6.97l-.948.316Zm-5.197 7.587c-.756-.272-1.254-.859-1.514-1.77-.265-.929-.271-2.17-.02-3.652.5-2.956 1.994-6.7 4.136-10.412l-.866-.5c-2.177 3.773-3.729 7.632-4.256 10.745-.263 1.554-.278 2.963.044 4.094.329 1.15 1.017 2.034 2.138 2.436l.338-.941Zm2.602-15.834c2.095-3.631 4.79-7.197 7.732-9.93l-.68-.733c-3.03 2.814-5.784 6.464-7.918 10.163l.866.5Zm7.732-9.93c3.639-3.381 9.444-5.868 14.387-5.256 2.452.304 4.684 1.367 6.363 3.46 1.685 2.1 2.85 5.284 3.063 9.891l.999-.046c-.22-4.746-1.425-8.157-3.282-10.471-1.863-2.323-4.346-3.495-7.02-3.826-5.31-.658-11.397 1.99-15.19 5.515l.68.733Zm23.814 8.037c-.396 5.66-1.933 14.495-5.254 22.58-3.327 8.104-8.396 15.336-15.783 17.98l.337.941c7.794-2.79 13.01-10.354 16.371-18.54 3.37-8.204 4.925-17.15 5.326-22.891l-.997-.07Zm-21.037 40.56c-2.345.84-4.075 1.175-5.292 1.192-1.235.018-1.833-.29-2.076-.601-.224-.285-.265-.73.03-1.323.291-.588.882-1.23 1.722-1.76 1.668-1.05 4.227-1.588 7.035-.386 2.813 1.205 5.948 4.193 8.666 10.343l.915-.404c-2.779-6.287-6.061-9.519-9.188-10.858-3.133-1.342-6.038-.75-7.961.46-.956.601-1.693 1.371-2.085 2.16-.39.785-.473 1.682.08 2.385.531.678 1.526 1.004 2.877.984 1.369-.02 3.215-.392 5.614-1.25l-.337-.942Zm10.109 7.512c3.54 6.17 13.41 13.188 24.622 9.264l-.33-.944c-10.628 3.72-20.049-2.933-23.425-8.818l-.867.498Zm24.622 9.264c3.897-1.364 6.222-2.943 7.304-4.543.548-.811.784-1.638.722-2.437-.061-.797-.415-1.518-.96-2.127-1.078-1.205-2.935-2.009-5.038-2.223a11.877 11.877 0 0 0-6.798 1.377l.474.88a10.878 10.878 0 0 1 6.222-1.262c1.943.198 3.534.932 4.396 1.895.426.476.666.997.707 1.537.042.538-.11 1.144-.553 1.8-.901 1.332-2.977 2.819-6.806 4.16l.33.943Zm-4.77-9.953c-1.1.593-1.833 1.118-2.26 1.573-.212.227-.377.466-.455.716a.91.91 0 0 0 .104.804c.157.228.397.349.615.412.223.065.475.085.73.074.514-.02 1.119-.168 1.71-.437 1.18-.537 2.412-1.611 2.721-3.31.309-1.695-.332-3.856-2.544-6.505l-.768.641c2.12 2.538 2.561 4.404 2.328 5.685-.232 1.278-1.165 2.13-2.151 2.578-.492.224-.97.334-1.336.35a1.336 1.336 0 0 1-.411-.036c-.096-.028-.093-.052-.07-.02.035.052.017.093.027.061.015-.049.07-.158.23-.329.318-.339.939-.802 2.004-1.377l-.474-.88Zm.62-6.673c-1.129-1.353-2.309-2.082-3.5-2.181-1.202-.1-2.287.449-3.197 1.375-1.8 1.83-3.085 5.287-3.573 9.186-.49 3.92-.188 8.39 1.29 12.31 1.482 3.928 4.156 7.33 8.411 9.032l.372-.928c-3.935-1.574-6.439-4.724-7.846-8.457-1.41-3.74-1.709-8.04-1.235-11.833.477-3.813 1.721-7.01 3.294-8.61.775-.788 1.586-1.147 2.4-1.079.825.07 1.781.586 2.817 1.826l.768-.64Zm-.569 29.722c4.198 1.679 7.808 1.685 11.058.768 3.232-.912 6.08-2.73 8.767-4.647 2.71-1.933 5.229-3.944 7.89-5.357 2.64-1.401 5.358-2.176 8.422-1.655l.168-.986c-3.352-.57-6.298.292-9.058 1.758-2.739 1.453-5.356 3.538-8.003 5.426-2.671 1.905-5.402 3.636-8.457 4.498-3.038.858-6.423.864-10.415-.733l-.372.928Z'
    />
  </svg>
);

const LeafIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={142}
    height={79}
    fill='none'
  >
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      d='M91.115 26.49c-4.543 6.521-9.698 24.364 6.028 43.568'
    />
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      d='M91.685 25.909c-1.782 7.602-2.18 25.696 10.489 37.255'
    />
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      d='M91.52 25.887c1.928 5.685 8.296 19.43 18.344 28.928M91.268 25.36c7.917 3.523 25.34 14.203 31.691 28.735M91.404 25.543C82.126 15.367 52.396-2.591 7.7 6.97'
    />
    <path
      stroke='#B4A29C'
      strokeLinecap='round'
      d='M133.525 45.144c-6.355-9.072-23.644-25.688-41.96-19.58'
    />
    <circle
      cx={134.2}
      cy={47.28}
      r={3}
      fill='#E5D8D4'
      transform='rotate(97.602 134.2 47.28)'
    />
    <circle
      cx={124.2}
      cy={57.28}
      r={3}
      fill='#E5D8D4'
      transform='rotate(97.602 124.2 57.28)'
    />
    <circle
      cx={112.2}
      cy={56.28}
      r={3}
      fill='#E5D8D4'
      transform='rotate(97.602 112.2 56.28)'
    />
    <circle
      cx={103.2}
      cy={64.28}
      r={3}
      fill='#E5D8D4'
      transform='rotate(97.602 103.2 64.28)'
    />
    <circle
      cx={98.2}
      cy={71.28}
      r={3}
      fill='#E5D8D4'
      transform='rotate(97.602 98.2 71.28)'
    />
  </svg>
);
