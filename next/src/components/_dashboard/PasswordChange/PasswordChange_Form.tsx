'use client';

import styles from './PasswordChange.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import type { FormTypes } from './PasswordChange.types';
import Input from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase-client';

const PasswordChangeForm = () => {
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormTypes>({
    mode: 'all',
  });

  const onSubmit: SubmitHandler<FormTypes> = async (data) => {
    setFetching(true);
    try {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (token && type) {
        const res = await fetch(`/api/auth/change-password?${searchParams.toString()}`, { cache: 'no-cache' }).then(
          (res) => res.json()
        );
        console.log('res: ', res);
      }

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) throw new Error(error.message);
      toast('Hasło zostało zmienione');
      router.push('/moje-konto/potwierdzenie-zmiany-hasla');
      setFetching(false);
    } catch (err) {
      if (err instanceof Error) toast.error((err as Error).message);
      setFetching(false);
    }
  };

  const inputValue = watch('password');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['form']}
    >
      <Input
        isRegister={true}
        password={true}
        label='Password'
        value={inputValue}
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
      <Button disabled={fetching}>Ustawiam nowe hasło</Button>
    </form>
  );
};

export default PasswordChangeForm;
