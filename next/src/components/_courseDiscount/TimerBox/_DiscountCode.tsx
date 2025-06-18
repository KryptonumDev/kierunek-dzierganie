'use client';

import { toast } from 'react-toastify';
import styles from './TimerBox.module.scss';

const DiscountCode = ({ discountCode, expirationDate }: { discountCode?: string; expirationDate?: string }) => {
  const hasExpired = !!expirationDate && new Date(expirationDate).getTime() < new Date().getTime();

  if (!discountCode || hasExpired) return null;
  return (
    <div className={styles.discountCode}>
      <span>{discountCode}</span>
      <button
        disabled={hasExpired}
        className='link'
        onClick={() => {
          toast('Kod został skopiowany do schowka');
          navigator.clipboard.writeText(discountCode || '');
        }}
      >
        Skopiuj kod
      </button>
    </div>
  );
};

export default DiscountCode;
