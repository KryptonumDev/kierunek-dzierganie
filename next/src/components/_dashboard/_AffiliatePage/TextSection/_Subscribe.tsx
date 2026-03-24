'use client';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import styles from './TextSection.module.scss';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

type FormValues = {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
};

export default function Subscribe({ userId, children }: { userId: string; children: React.ReactNode }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const subscribe = async () => {
    await fetch('/api/affiliate/join', {
      method: 'POST',
      body: JSON.stringify({ userId: userId }),
    })
      .then(() => {
        router.refresh();
      })
      .catch((err) => {
        toast(err.message);
      });
  };

  return (
    <form
      className={styles.subscribeForm}
      onSubmit={handleSubmit(subscribe)}
    >
      <Checkbox
        register={register('acceptTerms', {
          required: {
            value: true,
            message: 'Zgoda jest wymagana',
          },
        })}
        label={
          <>
            Akceptuję{' '}
            <Link
              className='link'
              href='/regulamin'
              target='_blank'
              rel='noopener'
            >
              regulamin serwisu
            </Link>{' '}
            oraz{' '}
            <Link
              className='link'
              href='/regulamin-programu-partnerskiego'
              target='_blank'
              rel='noopener'
            >
              regulamin programu partnerskiego
            </Link>
          </>
        }
        errors={errors}
      />
      <Checkbox
        register={register('acceptPrivacy', {
          required: {
            value: true,
            message: 'Zgoda jest wymagana',
          },
        })}
        label={
          <>
            Akceptuję{' '}
            <Link
              className='link'
              href='/polityka-prywatnosci'
              target='_blank'
              rel='noopener'
            >
              politykę prywatności
            </Link>
          </>
        }
        errors={errors}
      />
      <Button
        type='submit'
        className={styles.cta}
        disabled={!isValid}
      >
        {children}
      </Button>
    </form>
  );
}
