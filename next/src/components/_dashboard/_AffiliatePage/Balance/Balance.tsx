import Markdown from '@/components/ui/markdown';
import styles from './Balance.module.scss';
import { formatNumberToSpaces } from '@/utils/format-number-to-spaces';
import type { BalanceTypes } from './Balance.types';

const paragraph = (balance: number) =>
  `Masz już ${formatNumberToSpaces(balance ?? 0)} wirtualnych złotówek. Gdy dodasz **kurs** do koszyka, możesz zapłacić **zarówno zwykłymi, jak i wirtualnymi złotówkami**.\n\n**Uwaga:** Wirtualne złotówki można wykorzystać tylko przy zakupie kursów online. Nie można ich użyć do zakupu produktów fizycznych ani voucherów.`;

const Balance = ({ heading, balance, name }: BalanceTypes) => {
  heading = heading.replace(' ${name}', name ? ` ${name}` : '');

  return (
    <section className={styles['Balance']}>
      <Markdown.h1>{heading}</Markdown.h1>
      <p className={styles.coinParagraph}>Wirtualne złotówki:</p>
      <div className={styles.coin}>
        <CoinIcon />
        <span>{formatNumberToSpaces(balance)}</span>
      </div>
      <Markdown>{paragraph(balance)}</Markdown>
    </section>
  );
};

export default Balance;

const CoinIcon = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={150}
    height={137}
    viewBox='0 0 150 137'
    fill='none'
    {...props}
  >
    <path
      d='M139.692 37.645c.619 2.973 2.332 8.646 5.136 11.544.659-2.405.555-8.08-5.136-11.544Z'
      fill='#E5D8D4'
    />
    <path
      d='M139.578 37.064c.033.18.071.373.114.58m0 0c.619 2.974 2.332 8.647 5.136 11.545.659-2.405.555-8.08-5.136-11.544Z'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M131.23 27.43c4.536.129 14.45 2.513 17.82 11.018-5.682-3.196-17.202-9.875-17.82-11.019Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M131.328 28.439c-.916 3.292-1.1 11.525 5.5 18.125-.166-4-1.5-13.225-5.5-18.125Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M118.453 15.814c3.875-.75 12.875-.55 17.875 6.25-4.667-.75-14.775-3.05-17.875-6.25Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M116.453 16.189c.375 4.583 2.925 14.625 10.125 18.125-1.333-4.5-5.225-14.425-10.125-18.125Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M104.906 8.355c5.197-2.289 17.345-5.16 24.358 1.662-5.605.483-18.322.828-24.358-1.662Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M102.078 7.814c2.75 1.667 8.375 7.55 8.875 17.75-2.667-2.25-8.175-8.95-8.875-17.75Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M45.078 129.814c-3.875-1.917-14.275-5.25-24.875-3.25 3.292 2.5 12.875 6.65 24.875 3.25Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M46.203 129.314c-3.084-1.667-8.8-7.775-7-18.875 1.666 2.5 5.4 9.775 7 18.875Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M31.703 122.314c-2.708-2.333-10.35-6.825-19.25-6.125 1.459 2.5 7.35 7.225 19.25 6.125Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M34.828 123.314c-3.25-2.5-9.475-10.15-8.375-20.75 2.125 2.958 6.775 11.25 8.375 20.75Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12.579 103.189c-3.167-1.167-9.45-6.125-9.25-16.625 2.417 2.375 7.65 9.025 9.25 16.625Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M22.205 113.439c-2.959-3.917-8.65-13.75-7.75-21.75 2.583 3.458 7.75 12.65 7.75 21.75Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M18.282 111.399c-3.54-3.023-11.963-9.239-17.333-9.92 2.538 3.562 9.557 10.532 17.333 9.92Z'
      fill='#E5D8D4'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M140.329 38.189c-11.5-16.417-44.9-46.3-86.5-34.5-41.6 11.8-47.667 58.25-45.5 80'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12.328 103.439c13.334 17.833 51.5 47.5 97.5 23.5 13.5-8.083 38.7-34.75 31.5-76.75'
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
