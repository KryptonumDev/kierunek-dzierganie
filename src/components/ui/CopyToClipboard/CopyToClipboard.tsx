'use client';
import { useState } from 'react';
import styles from './CopyToClipboard.module.scss';
import type { Props } from './CopyToClipboard.types';

const CopyToClipboard = ({ copy }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <button
      className={styles['CopyToClipboard']}
      onClick={() => handleCopy()}
    >
      {copied ? (
        <>
          <SuccessIcon />
          <span>Skopiowano</span>
        </>
      ) : (
        <span>Skopiuj</span>
      )}
    </button>
  );
};

export default CopyToClipboard;

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
