'use client';
import { Hearth } from '@/components/ui/Icons';
import styles from './AddReview.module.scss';
import type { AddReviewTypes, FormTypes } from './AddReview.types';
import Input from '@/components/ui/Input';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const AddReview = ({ open, setOpen, user, product }: AddReviewTypes) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormTypes>({
    mode: 'all',
    defaultValues: {
      mark: 5,
    },
  });

  const onSubmit: SubmitHandler<FormTypes> = async (data) => {
    fetch('/api/review/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: data.mark,
        review: data.notes,
        nameOfReviewer: user,
        course: product.id,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setOpen(null);
          toast('Otrzymaliśmy Twoją opinię. Dziękujemy!');
        }
      })
      .catch((err) => {
        console.log(err);
        toast('Błąd podczas wysyłania opinii');
      });
  };

  const mark = watch('mark');

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  });

  return (
    <>
      <div
        onClick={() => setOpen(null)}
        data-active={open}
        className={styles['overlay']}
      ></div>
      <div
        data-active={open}
        className={styles['AddReview']}
      >
        <h2>
          Dodaj <strong>opinię</strong>
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>Oceń {product.type === 'product' ? 'produkt' : product.type === 'course' ? 'kurs' : 'pakiet'}</p>
          <div className={styles['group']}>
            <label
              data-active={mark > 0}
              className={styles['mark']}
            >
              <input
                type='radio'
                value={1}
                {...register('mark')}
              />
              <Hearth />
            </label>
            <label
              data-active={mark > 1}
              className={styles['mark']}
            >
              <input
                type='radio'
                value={2}
                {...register('mark')}
              />
              <Hearth />
            </label>
            <label
              data-active={mark > 2}
              className={styles['mark']}
            >
              <input
                type='radio'
                value={3}
                {...register('mark')}
              />
              <Hearth />
            </label>
            <label
              data-active={mark > 3}
              className={styles['mark']}
            >
              <input
                type='radio'
                value={4}
                {...register('mark')}
              />
              <Hearth />
            </label>
            <label
              data-active={mark > 4}
              className={styles['mark']}
            >
              <input
                type='radio'
                value={5}
                {...register('mark')}
              />
              <Hearth />
            </label>
          </div>
          <Input
            textarea={true}
            label='Napisz, z czego wynika Twoja ocena'
            placeholder='Napisz co siedzi Ci w głowie'
            rows={2}
            register={register('notes')}
            errors={errors}
          />
          <Checkbox
            label={<>Zgadzam się na przetwarzanie moich danych?</>}
            register={register('privacy', {
              required: {
                value: true,
                message: 'Zgoda jest wymagana',
              },
            })}
            errors={errors}
          />
          <Button type='submit'>Prześlij opinię</Button>
        </form>
      </div>
    </>
  );
};

export default AddReview;
