import styles from './ShareArticle.module.scss';
import type { ShareArticleTypes } from './ShareArticle.types';
import Share from './Share';

const ShareArticle = ({ facebook, pinterest }: ShareArticleTypes) => {
  return (
    <section className={styles['ShareArticle']}>
      <a
        href={facebook}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FacebookIcon />
      </a>
      <a
        href={pinterest}
        target='_blank'
        rel='noopener noreferrer'
      >
        <PinterestIcon />
      </a>
      <Share ShareIcon={<ShareIcon />} />
    </section>
  );
};

export default ShareArticle;

function FacebookIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
    >
      <g clipPath='url(#a)'>
        <path
          fill='#9A827A'
          d='M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z'
        ></path>
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M0 0h24v24H0z'
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <g clipPath='url(#a)'>
        <path
          fill='#9A827A'
          d='M12 0C5.372 0 0 5.372 0 12c0 5.086 3.164 9.427 7.627 11.175-.104-.952-.202-2.405.042-3.44.22-.938 1.406-5.963 1.406-5.963s-.36-.717-.36-1.781c0-1.67.965-2.916 2.17-2.916 1.021 0 1.518.769 1.518 1.692 0 1.031-.656 2.569-.994 3.994-.28 1.195.6 2.17 1.777 2.17 2.133 0 3.773-2.25 3.773-5.494 0-2.873-2.062-4.884-5.01-4.884-3.413 0-5.42 2.56-5.42 5.208 0 1.031.4 2.137.896 2.737a.359.359 0 01.084.343c-.089.38-.295 1.195-.332 1.359-.052.22-.174.267-.404.16-1.5-.7-2.437-2.888-2.437-4.65 0-3.788 2.751-7.262 7.926-7.262 4.163 0 7.397 2.968 7.397 6.933 0 4.135-2.606 7.463-6.225 7.463-1.214 0-2.357-.633-2.751-1.378l-.746 2.854c-.271 1.04-1.003 2.349-1.49 3.146C9.572 23.812 10.763 24 12 24c6.628 0 12-5.372 12-12S18.628 0 12 0z'
        ></path>
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M0 0h24v24H0z'
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <path
        fill='#9A827A'
        stroke='#9A827A'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.25 6a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm-15 6a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z'
      ></path>
      <path
        stroke='#9A827A'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.25 6.688l-10.5 4.5m10.125 6.96L6.414 13.56'
      ></path>
      <path
        fill='#9A827A'
        stroke='#9A827A'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.25 19a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z'
      ></path>
    </svg>
  );
}
