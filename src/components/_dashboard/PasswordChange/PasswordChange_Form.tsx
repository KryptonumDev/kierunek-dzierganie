'use client';

import styles from './PasswordChange.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import type { FormTypes } from './PasswordChange.types';
import Input from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const PasswordChangeForm = () => {
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormTypes>({
    mode: 'all',
  });

  const onSubmit: SubmitHandler<FormTypes> = async (data) => {
    setFetching(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) throw new Error(error.message);
      toast('Hasło zostało zmienione');
      router.push('/moje-konto/potwierdzenie-zmiany-hasla');
      setFetching(false);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      setFetching(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['form']}
    >
      <Input
        isRegister={true}
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
      <Button disabled={fetching}>Ustawiam nowe hasło</Button>
    </form>
  );
};

export default PasswordChangeForm;
