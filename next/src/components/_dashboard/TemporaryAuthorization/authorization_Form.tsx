'use client';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/PasswordInput';
import { REGEX } from '@/global/constants';
import { checkAccountExists } from '@/utils/check-account-exists';
import { normalizeEmail } from '@/utils/normalize-email';
import { createClient } from '@/utils/supabase-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { FormProps, FormValues } from './authorization.types';

const EXISTING_ACCOUNT_MESSAGE = 'Konto z tym adresem e-mail już istnieje. Zaloguj się lub ustaw hasło.';
const SIGNUP_RECOVERY_MESSAGE =
  'Nie udało się dokończyć rejestracji. Jeśli konto już istnieje, zaloguj się lub ustaw hasło.';

const getAuthErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Wystąpił błąd. Spróbuj ponownie.';

  if (message === 'Invalid login credentials') {
    return 'Nieprawidłowe dane logowania!';
  }

  if (
    message === 'User already registered' ||
    message.toLowerCase().includes('user_already_exists') ||
    (message.toLowerCase().includes('already') && message.toLowerCase().includes('exist'))
  ) {
    return EXISTING_ACCOUNT_MESSAGE;
  }

  return message;
};

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
    try {
      if (isRegister) {
        const { exists, normalizedEmail } = await checkAccountExists(data.email);

        if (exists) {
          toast(EXISTING_ACCOUNT_MESSAGE);
          setRegister(false);
          return;
        }

        const res = await supabase.auth.signUp({
          email: normalizedEmail,
          password: data.password,
        });

        if (res.error) {
          throw res.error;
        }

        if (!res.data.user) {
          toast(SIGNUP_RECOVERY_MESSAGE);
          setRegister(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', res.data.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          toast(SIGNUP_RECOVERY_MESSAGE);
          setRegister(false);
          return;
        }

        router.push('/moje-konto/potwierdzenie-rejestracji');
        return;
      }

      const res = await supabase.auth.signInWithPassword({
        email: normalizeEmail(data.email),
        password: data.password,
      });

      if (res.error) {
        throw res.error;
      }

      window.location.reload();
    } catch (error) {
      toast(getAuthErrorMessage(error));
      console.error(error); // TODO: Add error handling
    } finally {
      setIsSubmitting(false);
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
