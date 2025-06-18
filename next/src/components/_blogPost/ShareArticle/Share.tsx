'use client';

import styles from './ShareArticle.module.scss';
import { useState } from 'react';

export default function Share({ ShareIcon }: { ShareIcon: JSX.Element }) {
  const [didCopy, setDidCopy] = useState(false);

  const buttonHandleClick = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setDidCopy(true);
    setTimeout(() => setDidCopy(false), 3000);
  };

  return (
    <>
      <button onClick={buttonHandleClick}>{ShareIcon}</button>
      {didCopy && (
        <div className={styles.copyMessage}>
          <SuccessIcon />
          <span>Skopiowano</span>
        </div>
      )}
    </>
  );
}

const SuccessIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='17'
    fill='none'
    viewBox='0 0 16 17'
    stroke='#5C7360'
  >
    <path
      strokeMiterlimit='10'
      d='M14 8.5c0-3.313-2.688-6-6-6-3.313 0-6 2.688-6 6 0 3.313 2.688 6 6 6 3.313 0 6-2.688 6-6z'
    ></path>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11 6l-4.2 5L5 9'
    ></path>
  </svg>
);
