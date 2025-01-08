'use client';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import { mailerLiteGroup, REGEX } from '@/global/constants';
import { DiscountCourseType } from '@/global/types';
import { encodeEmail } from '@/utils/email-cipher';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import Loading from './_Loading';
import State from './_State';
import styles from './Newsletter.module.scss';
import type { StatusProps } from './Newsletter.types';

const Form = ({
  Heading,
  groupId,
  dedicatedThankYouPage,
}: {
  Heading: React.ReactNode;
  groupId?: string;
  dedicatedThankYouPage?: {
    name?: string;
    slug?: string;
    hasDiscount?: boolean;
    discountCourse?: DiscountCourseType;
  };
}) => {
  const [status, setStatus] = useState<StatusProps>({ sending: false });
  const router = useRouter();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data: FieldValues) => {
    setStatus({ sending: true });
    data.groupID = groupId || mailerLiteGroup.newsletter;
    data.dedicatedThankYouPage = dedicatedThankYouPage;

    if (dedicatedThankYouPage?.hasDiscount) {
      try {
        const response = await fetch('/api/discount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            groupID: groupId,
            duration: dedicatedThankYouPage.discountCourse?.discountTime,
            amount: dedicatedThankYouPage.discountCourse?.discount,
            course: {
              id: dedicatedThankYouPage.discountCourse?.course._id,
              name: dedicatedThankYouPage.discountCourse?.course.name,
            },
          }),
        });
        const responseData = await response.json();
        if (response.ok && responseData.success) {
          router.push(
            `${pathname}/${dedicatedThankYouPage.slug}?subscriber=${encodeEmail(data.email)}&group=${groupId}`
          );
          return;
        }
      } catch {
        setStatus((prevStatus) => ({ ...prevStatus, success: false }));
      }
    } else {
      try {
        const response = await fetch('/api/mailerlite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
          if (typeof fbq !== 'undefined') {
            fbq('track', 'CompleteRegistration');
          }
          if (dedicatedThankYouPage) {
            router.push(`${pathname}/${dedicatedThankYouPage.slug}`);
            return;
          }
          setStatus((prevStatus) => ({ ...prevStatus, success: true }));
          reset();
        } else {
          setStatus((prevStatus) => ({ ...prevStatus, success: false }));
        }
      } catch {
        setStatus((prevStatus) => ({ ...prevStatus, success: false }));
      }
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
            Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
            <a
              className='link'
              href='/polityka-prywatnosci'
              target='_blank'
              rel='noopener'
            >
              polityką prywatności
            </a>
            . Wiem, że w każdej chwili mogę wypisać się z newslettera i cofnąć tę zgodę.
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
