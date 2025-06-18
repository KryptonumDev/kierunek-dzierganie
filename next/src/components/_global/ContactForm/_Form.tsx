'use client';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { REGEX } from '@/global/constants';
import { formatPhoneNumber } from '@/utils/format-phone-number';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import Loading from './_Loading';
import State from './_State';
import styles from './ContactForm.module.scss';
import type { StatusProps } from './ContactForm.types';

const Form = ({ aboveTheFold, emails }: { aboveTheFold: boolean; emails: { label: string; value: string }[] }) => {
  const [status, setStatus] = useState<StatusProps>({ sending: false });
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data: FieldValues) => {
    setStatus({ sending: true });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        setStatus((prevStatus) => ({ ...prevStatus, success: true }));
        reset();
      } else {
        setStatus((prevStatus) => ({ ...prevStatus, success: false }));
      }
    } catch {
      setStatus((prevStatus) => ({ ...prevStatus, success: false }));
    }
  };

  return (
    <form
      className={styles['Form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Select<FieldValues>
        control={control}
        name={'subject'}
        rules={{ required: 'Pole wymagane' }}
        label='Temat wiadomości'
        errors={errors}
        defaultValue={emails[0]}
        options={emails}
      />
      <Input
        label='Imię'
        autoFocus={aboveTheFold}
        register={register('name', {
          required: { value: true, message: 'Imię jest wymagane' },
          minLength: { value: 2, message: 'Imię jest za krótkie' },
          pattern: { value: REGEX.string, message: 'Imię jest za krótkie' },
        })}
        errors={errors}
      />
      <Input
        label='E-mail'
        type='email'
        register={register('email', {
          required: { value: true, message: 'E-mail jest wymagany' },
          pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
        })}
        errors={errors}
      />
      <Input
        label='Nr telefonu (opcjonalnie)'
        type='tel'
        placeholder='_ _ _ - _ _ _ - _ _ _'
        register={register('tel', {
          pattern: { value: REGEX.phone, message: 'Niepoprawny numer telefonu' },
          onChange: (e) => formatPhoneNumber(e),
        })}
        errors={errors}
      />
      <Input
        label='Temat wiadomości'
        placeholder='Napisz, co siedzi Ci w głowie:'
        textarea={true}
        register={register('message', {
          required: { value: true, message: 'Temat wiadomości jest wymagany' },
        })}
        errors={errors}
      />
      <Checkbox
        label={
          <>
            Zgadzam się na{' '}
            <Link
              className='link'
              href='/polityka-prywatnosci'
              target='_blank'
              rel='noopener'
            >
              przetwarzanie moich danych
            </Link>
          </>
        }
        register={register('legal', {
          required: { value: true, message: 'Zgoda jest wymagana' },
        })}
        errors={errors}
      />
      <Button
        disabled={status?.sending}
        type='submit'
      >
        Wyślij wiadomość
      </Button>
      <State
        success={status?.success}
        setStatus={setStatus}
      />
      <Loading loading={status?.sending} />
    </form>
  );
};

export default Form;
