import { useRouter } from 'next/navigation';
import styles from './Checkout.module.scss';
import type { MappingProps } from './Checkout.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { REGEX } from '@/global/constants';
import PasswordInput from '@/components/ui/PasswordInput';
import { useState } from 'react';
import Input from '@/components/ui/Input';
// import OAuthMethods from "@/components/organisms/oAuth-methods";

type FormValues = {
  email: string;
  password: string;
  accept: boolean;
};

export default function Authorization({ setStep, goToCart }: MappingProps) {
  const [isRegister, setRegister] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
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
          // TODO: check is account created before activation
          toast('Na podany adres e-mail został wysłany link aktywacyjny');
          setStep(2);
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
          setStep(2);
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
    <>
      <form
        className={`${styles['main']} ${styles['authorization']}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <legend>Zaloguj się, aby mieć dostęp do swoich kursów</legend>
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
        <PasswordInput
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
      <div className={styles.buttons}>
        <button
          className={`link ${styles['return']}`}
          type='button'
          onClick={goToCart}
        >
          Wróć do koszyka
        </button>
      </div>
    </>
  );
}
