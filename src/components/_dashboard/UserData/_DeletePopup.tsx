import Input from '@/components/ui/Input';
import styles from './UserData.module.scss';
import type { DeletePopupFormTypes, DeletePopupDataTypes } from './UserData.types';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function DeletePopup({ openDeletePopup, setOpenDeletePopup }: DeletePopupDataTypes) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeletePopupFormTypes>({
    mode: 'all',
  });

  const onSubmit = async () => {};

  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDeletePopup(false);
      }
    },
    [setOpenDeletePopup]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  return (
    <AnimatePresence mode='wait'>
      {openDeletePopup && (
        <motion.div
          key='overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpenDeletePopup(false)}
          className={styles['overlay']}
        />
      )}
      {openDeletePopup && (
        <motion.form
          key='popup'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className={styles['delete-popup']}
        >
          <button
            type='button'
            onClick={() => setOpenDeletePopup(false)}
            className={styles['cross']}
          >
            <CrossIcon />
          </button>
          <h2>Czy na pewno chcesz usunąć konto?</h2>
          <p>Bezpowrotnie stracisz dostęp do wszystkich zakupionych kursów</p>
          <Input
            register={register('confirmation', {
              validate: (value) => value === 'usuwam' || 'Niepoprawne hasło',
            })}
            label='Wpisz „usuwam”, jeśli chcesz usunąć konto'
            errors={errors}
          />
          <div className={styles['buttons']}>
            <button
              type='button'
              onClick={() => setOpenDeletePopup(false)}
              className='link'
            >
              Anuluj
            </button>
            <Button type='submit'>Usuwam konto</Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

const CrossIcon = () => (
  <svg
    width='24'
    height='25'
    viewBox='0 0 24 25'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M17.25 17.5171L6.75 7.01709M17.25 7.01709L6.75 17.5171'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
