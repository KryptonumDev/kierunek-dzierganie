'use client';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import { type FieldValues, useForm } from 'react-hook-form';
import styles from './Newsletter.module.scss';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { StatusProps } from './Newsletter.types';
import { mailerLiteGroup, regex } from '@/global/constants';
import Link from 'next/link';
import State from './_State';
import Loading from './_Loading';

const Form = ({ Heading }: { Heading: React.ReactNode }) => {
  const [status, setStatus] = useState<StatusProps>({ sending: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data: FieldValues) => {
    setStatus({ sending: true });
    data.groupID = mailerLiteGroup.newsletter;
    try {
      const response = await fetch('/api/mailerlite', {
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
      {Heading}
      <div className={styles.column}>
        <Input
          label='Imię'
          register={register('name', {
            required: { value: true, message: 'Imię jest wymagane' },
            minLength: { value: 2, message: 'Imię jest za krótkie' },
            pattern: { value: regex.string, message: 'Imię jest za krótkie' },
          })}
          errors={errors}
        />
        <Input
          label='E-mail'
          type='email'
          register={register('email', {
            required: { value: true, message: 'E-mail jest wymagany' },
            pattern: { value: regex.email, message: 'Niepoprawny adres e-mail' },
          })}
          errors={errors}
        />
      </div>
      <Checkbox
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
            i&nbsp;
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
        register={register('legal', {
          required: { value: true, message: 'Zgoda jest wymagana' },
        })}
        errors={errors}
      />
      <Button
        type='submit'
        className={styles.cta}
        disabled={status?.sending}
      >
        Zapisuje się
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
