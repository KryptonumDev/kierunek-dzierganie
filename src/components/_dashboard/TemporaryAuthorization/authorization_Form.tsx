'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { FormValues, FormProps } from './authorization.types';
import Input from '@/components/ui/PasswordInput';
import { REGEX } from '@/global/constants';
import Checkbox from '@/components/ui/Checkbox';
import { useState } from 'react';
import { createClient } from '@/utils/supabase-client';
import Link from 'next/link';

const AuthorizationForm = ({ isRegister, setRegister }: FormProps) => {
  const supabase = createClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState('');

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setIsSubmitting(true);
    if (isRegister) {
      await supabase.auth
        .signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${location.origin}/api/auth/confirm`,
          },
        })
        .then((res) => {
          if (res.error) throw res.error;
          router.push('/moje-konto/potwierdzenie-rejestracji');
        })
        .catch((error) => {
          toast(error.message);
          console.error(error); // TODO: Add error handling
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      await supabase.auth
        .signInWithPassword({
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          if (res.error) throw res.error;

          router.push('/moje-konto/kursy');
        })
        .catch((error) => {
          let message = error.message;
          if (message === 'Invalid login credentials') {
            message = 'Nieprawidłowe dane logowania! Proszę spróbować ponownie.';
          }
          toast(message);
          console.error(error); // TODO: Add error handling
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label='E-mail'
        register={register('email', {
          required: {
            value: true,
            message: 'Pole wymagane',
          },
          pattern: {
            value: REGEX.email,
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
          onChange: (e) => {
            setValue(e.target.value);
          },
          ...(isRegister && {
            minLength: {
              value: 12,
              message: 'Co najmniej 12 znaków',
            },
          }),
        })}
        value={value}
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
          label={
            <>
              Akceptuję warunki{' '}
              <Link
                className='link'
                href='/polityka-prywatnosci'
                target='_blank'
                rel='noopener'
              >
                polityki prywatności
              </Link>{' '}
              i 
              <Link
                className='link'
                href='/regulamin'
                target='_blank'
                rel='noopener'
              >
                regulaminu
              </Link>
            </>
          }
          errors={errors}
        />
      )}
      <Button disabled={isSubmitting}>{isRegister ? 'Zarejestruj się' : 'Zaloguj się'}</Button>
      {isRegister ? (
        <p>
          Masz już konto?{' '}
          <button
            className='link'
            onClick={() => {
              setRegister(false);
            }}
            type='button'
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            Zarejestruj się
          </button>
        </p>
      )}
    </form>
  );
};

export default AuthorizationForm;
