import styles from './QuoteSection.module.scss';
import type { QuoteSectionTypes } from './QuoteSection.types';

const QuoteSection = ({ quote }: QuoteSectionTypes) => {
  return (
    <div className={styles['QuoteSection']}>
      <>
        <QuoteIcon className={styles.icon} />
        {quote}
      </>
    </div>
  );
};

export default QuoteSection;

function QuoteIcon({ className }: { className: string | undefined }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='40'
      height='43'
      fill='none'
      className={className}
    >
      <path
        fill='#EFE8E7'
        d='M15.36 2.412c2.583 1.892 3.497 4.827 3.24 8.32-6.819 3.393-13.01 4.15-11.635-3.365C8.177.743 13.507.743 15.361 2.412zm19.064 0c2.473 1.812 3.458 4.427 3.372 7.5-3.894 4.217-13.11 4.791-11.768-2.545C27.24.743 32.57.743 34.424 2.412z'
      ></path>
      <path
        stroke='#EFE8E7'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M1 41.483c7.844-8.038 16.915-21.396 17.6-30.75m0 0c.257-3.494-.657-6.43-3.24-8.32C13.508.742 8.178.742 6.966 7.366c-1.375 7.515 4.816 6.758 11.636 3.365zm0 0a46.558 46.558 0 002.094-1.113m0 29.605c7.968-8.165 16.857-20.584 17.102-29.313m0 0c.086-3.073-.899-5.688-3.372-7.5C32.57.743 27.24.743 26.028 7.367c-1.342 7.336 7.874 6.762 11.768 2.545zm0 0c.5-.542.913-1.144 1.204-1.797'
      ></path>
    </svg>
  );
}
