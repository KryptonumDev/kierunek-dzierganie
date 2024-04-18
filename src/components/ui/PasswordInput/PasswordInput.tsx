'use client';
import { useState } from 'react';
import styles from './PasswordInput.module.scss';
import type { Props } from './PasswordInput.types';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

const PasswordInput = ({ textarea, label, register, errors, password, isRegister, value, ...props }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label
      className={`${styles['PasswordInput']} ${errors[register.name] ? styles['errored'] : ''} ${password ? styles['password'] : ''}`}
    >
      <div className={styles['label-wrap']}>
        <p
          className={styles.label}
          dangerouslySetInnerHTML={{ __html: label }}
        />
        {!isRegister && (
          <AnimatePresence mode='wait'>
            {errors[register.name] && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.46, 0.03, 0.52, 0.96] }}
                className={styles.error}
                role='alert'
              >
                <ErrorIcon /> {errors[register.name]?.message?.toString() || 'Proszę poprawnie uzupełnić to pole'}
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </div>
      {textarea ? (
        <textarea
          data-lenis-prevent
          {...register}
          {...props}
          name={register.name}
        />
      ) : (
        <div className={styles['input-wrap']}>
          <input
            {...register}
            {...props}
            name={register.name}
            type={password && !showPassword ? 'password' : 'text'}
          />
          {password && (
            <button
              className='link'
              type='button'
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
            </button>
          )}

          {isRegister && !props.disabled && (
            <p
              className={`${styles['input-info']}  ${value?.length >= 12 ? styles['success'] : ''} ${errors[register.name] && value?.length < 12 ? styles['errored'] : ''}`}
            >
              <span
                // @ts-expect-error - Using css variables
                style={{ '--progress': (value?.length / 12) * 100 + '%' }}
                className={`${styles.progress}`}
              />
              Co najmniej 12 znaków
            </p>
          )}
          {password && !isRegister && (
            <Link
              className={`${styles['input-info']}`}
              href={'/moje-konto/przypomnij-haslo'}
            >
              Przypomnij hasło
            </Link>
          )}
        </div>
      )}
    </label>
  );
};

export default PasswordInput;

const ErrorIcon = () => (
  <svg
    width='16'
    height='17'
    viewBox='0 0 16 17'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M14 8.5C14 5.1875 11.3125 2.5 8 2.5C4.6875 2.5 2 5.1875 2 8.5C2 11.8125 4.6875 14.5 8 14.5C11.3125 14.5 14 11.8125 14 8.5Z'
      stroke='#BC4B4B'
      strokeMiterlimit='10'
    />
    <path
      d='M7.8205 5.68897L7.99987 9.49991L8.17893 5.68897C8.18004 5.66461 8.17617 5.64028 8.16755 5.61746C8.15893 5.59465 8.14575 5.57383 8.12882 5.55628C8.11189 5.53873 8.09155 5.52482 8.06906 5.5154C8.04656 5.50597 8.02238 5.50124 7.998 5.50147C7.9739 5.5017 7.9501 5.50678 7.92801 5.51641C7.90591 5.52604 7.88599 5.54002 7.86942 5.55752C7.85286 5.57502 7.83999 5.59568 7.83158 5.61827C7.82317 5.64085 7.8194 5.6649 7.8205 5.68897Z'
      stroke='#BC4B4B'
      strokeWidth='0.75'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M8 11.9971C7.87639 11.9971 7.75555 11.9604 7.65277 11.8917C7.54999 11.8231 7.46988 11.7255 7.42258 11.6112C7.37527 11.497 7.36289 11.3714 7.38701 11.2501C7.41113 11.1289 7.47065 11.0175 7.55806 10.9301C7.64547 10.8427 7.75683 10.7832 7.87807 10.7591C7.99931 10.735 8.12497 10.7473 8.23918 10.7946C8.35338 10.842 8.45099 10.9221 8.51967 11.0248C8.58834 11.1276 8.625 11.2485 8.625 11.3721C8.625 11.5378 8.55915 11.6968 8.44194 11.814C8.32473 11.9312 8.16576 11.9971 8 11.9971Z'
      fill='#BC4B4B'
      stroke='#BC4B4B'
      strokeWidth='0.0625'
    />
  </svg>
);
