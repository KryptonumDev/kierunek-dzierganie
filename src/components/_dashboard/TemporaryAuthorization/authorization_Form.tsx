'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { FormValues, FormProps } from './authorization.types';
import Input from '@/components/ui/PasswordInput';
import { REGEX } from '@/global/constants';
import Checkbox from '@/components/ui/Checkbox';
import { useState } from 'react';

const AuthorizationForm = ({ isRegister, setRegister }: FormProps) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setIsSubmitting(true);
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
          toast(error.message);
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
          ...(isRegister && {
            minLength: {
              value: 12,
              message: 'Co najmniej 12 znaków',
            },
          }),
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
