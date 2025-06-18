'use client';
import styles from './PasswordChangeEmail.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormTypes } from './PasswordChangeEmail.types';
import Input from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { REGEX } from '@/global/constants';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { createClient } from '@/utils/supabase-client';

const PasswordChangeEmailForm = () => {
  const [fetching, setFetching] = useState(false);
  const supabase = createClient();
  const [isSended, setIsSended] = useState(false);

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
      const res = await supabase.auth.resetPasswordForEmail(data.email);
      if (res.error) throw new Error(res.error.message);

      toast('Link do zmiany hasła został wysłany na podany adres e-mail');
      setFetching(false);
      setIsSended(true);
    } catch (err) {
      if (err instanceof Error) toast(err.message);
      setFetching(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['form']}
    >
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
      <Button disabled={fetching || isSended}>
        {isSended ? 'Link do zmiany hasła został wysłany' : 'Wyślij link do zmiany hasła'}
      </Button>
    </form>
  );
};

export default PasswordChangeEmailForm;
