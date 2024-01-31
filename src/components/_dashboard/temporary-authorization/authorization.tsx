'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './authorization.module.scss';
import Button from '@/components/ui/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { FormValues, Props } from './authorization.types';

const Authorization = ({ registerTitle, loginTitle, registerText, loginText }: Props) => {
  const supabase = createClientComponentClient();
  const [isRegister, setRegister] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isRegister) {
      await supabase.auth
        .signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${location.origin}/api/auth/callback`,
          },
        })
        .then((res) => {
          if (res.error) throw res.error;
          router.push('/moje-konto/autoryzacja/potwierdzenie-rejestracji');
        })
        .catch((error) => {
          toast(error.message);
          console.error(error); // TODO: Add error handling
        });
    } else {
      await supabase.auth
        .signInWithPassword({
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          if (res.error) throw res.error;
          router.refresh();
        })
        .catch((error) => {
          toast(error.message);
          console.error(error); // TODO: Add error handling
        });
    }
  };

  return (
    <section className={styles['Authorization']}>
      {isRegister ? registerTitle : loginTitle}
      {isRegister ? registerText : loginText}
      <div className={styles['grid']}>
        <div className={styles['providers']}></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            E-mail
            <input
              {...register('email')}
              type='text'
            />
          </label>
          <label>
            Hasło
            <input
              {...register('password')}
              type='password'
            />
          </label>
          <Button theme='primary'>{isRegister ? 'Zaloguj się' : 'Zaloguj się'}</Button>
          {isRegister ? (
            <p>
              Masz już konto?{' '}
              <button
                className='link'
                onClick={() => {
                  setRegister(false);
                }}
                type='button'
              >
                Zaloguj się
              </button>
            </p>
          ) : (
            <p>
              Nie masz jeszcze konta?{' '}
              <button
                className='link'
                onClick={() => {
                  setRegister(true);
                }}
                type='button'
              >
                Zarejestruj się
              </button>
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Authorization;
