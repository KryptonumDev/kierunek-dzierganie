'use client';
import styles from './Error.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import type { Props } from './Error.types';

const Error = ({ error }: Props) => {
  return (
    <AnimatePresence
      initial={false}
      mode='wait'
    >
      {error && (
        <motion.span
          data-error
          className={styles['Error']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role='alert'
        >
          <ErrorIcon />
          <span>{error}</span>
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default Error;

const ErrorIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='17'
    fill='none'
    stroke='#BC4B4B'
    viewBox='0 0 16 17'
  >
    <path
      strokeMiterlimit='10'
      d='M14 8.5c0-3.313-2.688-6-6-6-3.313 0-6 2.688-6 6 0 3.313 2.688 6 6 6 3.313 0 6-2.688 6-6z'
    ></path>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='0.75'
      d='M7.82 5.689L8 9.499l.179-3.81a.18.18 0 10-.359 0z'
    ></path>
    <path
      fill='#BC4B4B'
      strokeWidth='0.063'
      d='M8 11.997a.625.625 0 110-1.25.625.625 0 010 1.25z'
    ></path>
  </svg>
);
