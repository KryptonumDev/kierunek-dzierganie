'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './authorization.module.scss';
import Button from '@/components/ui/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { FormValues, Props } from './authorization.types';
import Input from '@/components/ui/Input';
import { regex } from '@/global/constants';
import Checkbox from '@/components/ui/Checkbox';

const Authorization = ({ registerTitle, loginTitle, registerText, loginText }: Props) => {
  const supabase = createClientComponentClient();
  const [isRegister, setRegister] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
  });

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
          router.push(`/moje-konto/autoryzacja/potwierdzenie-rejestracji?provider=${data.email.split('@')[1]}`);
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
        <div className={styles['providers']}>TUTAJ BĘDĄ OAUTH PROWIDERY</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label='E-mail'
            register={register('email', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
              pattern: {
                value: regex.email,
                message: 'Proszę wpisać poprawny e-mail',
              },
            })}
            errors={errors}
          />
          <Input
            isRegister={isRegister}
            password={true}
            label='Password'
            register={register('password', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
              minLength: {
                value: 12,
                message: 'Co najmniej 12 znaków',
              },
            })}
            errors={errors}
          />
          {isRegister && (
            <Checkbox
              register={register('accept', {
                required: {
                  value: true,
                  message: 'Zgoda jest wymagana',
                },
              })}
              label='Akceptuję warunki polityki prywatności i regulaminu'
              errors={errors}
            />
          )}
          <Button>{isRegister ? 'Zarejestruj się' : 'Zaloguj się'}</Button>
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
