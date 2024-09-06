'use client';
import { useState } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import styles from './Newsletter.module.scss';
import { mailerLiteGroup, REGEX } from '@/global/constants';
import State from './_State';
import Loading from './_Loading';
import type { StatusProps } from './Newsletter.types';

const Form = ({ Heading, groupId }: { Heading: React.ReactNode, groupId?: string }) => {
  const [status, setStatus] = useState<StatusProps>({ sending: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data: FieldValues) => {
    setStatus({ sending: true });
    data.groupID = groupId || mailerLiteGroup.newsletter;
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
        if (typeof fbq !== 'undefined') {
          fbq('track', 'CompleteRegistration');
        }
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
      </div>
      <Checkbox
        label={
          <>
            Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z
            {' '}
            <a
              className='link'
              href='/polityka-prywatnosci'
              target='_blank'
              rel='noopener'
            >
              polityką prywatności
            </a>
            .{' '} Wiem, że w każdej chwili mogę wypisać się z newslettera i cofnąć tę zgodę.
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
        Zapisuję się
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
