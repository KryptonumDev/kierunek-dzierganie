'use client';

import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import { mailerLiteGroup, REGEX } from '@/global/constants';
import { encodeEmail } from '@/utils/email-cipher';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ProductOptionsSection.module.scss';
import type { ProductOptionsSectionNewsletterItem } from './ProductOptionsSection.types';

type FormValues = {
  name: string;
  email: string;
  legal: boolean;
};

const successMessage =
  'Sprawdź swoją skrzynkę pocztową i potwierdź adres e-mail. Jeśli nic nie widzisz, sprawdź też foldery SPAM, Oferty lub Społeczności.';
const errorMessage = 'Nie udało nam się zapisać Cię do newslettera. Spróbuj ponownie.';
const defaultButtonLabel = 'Zapisuję się';

const NewsletterItemForm = ({
  groupId,
  buttonLabel,
  dedicatedThankYouPage,
}: Pick<ProductOptionsSectionNewsletterItem, 'groupId' | 'buttonLabel' | 'dedicatedThankYouPage'>) => {
  const [status, setStatus] = useState<{ sending: boolean; success?: boolean }>({ sending: false });
  const router = useRouter();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const onSubmit = async (data: FormValues) => {
    const resolvedGroupId = groupId || mailerLiteGroup.newsletter;
    setStatus({ sending: true });

    if (dedicatedThankYouPage?.hasDiscount) {
      try {
        const response = await fetch('/api/discount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            groupID: resolvedGroupId,
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
          if (typeof fbq !== 'undefined') {
            fbq('track', 'CompleteRegistration');
          }
          router.push(
            `${pathname}/${dedicatedThankYouPage.slug}?subscriber=${encodeEmail(data.email)}&group=${resolvedGroupId}`
          );
          return;
        }
      } catch {
        setStatus({ sending: false, success: false });
        return;
      }

      setStatus({ sending: false, success: false });
      return;
    }

    try {
      const response = await fetch('/api/mailerlite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          groupID: resolvedGroupId,
        }),
      });
      const responseData = await response.json();

      if (response.ok && responseData.success) {
        if (typeof fbq !== 'undefined') {
          fbq('track', 'CompleteRegistration');
        }
        if (dedicatedThankYouPage?.slug) {
          router.push(`${pathname}/${dedicatedThankYouPage.slug}`);
          return;
        }
        setStatus({ sending: false, success: true });
        reset();
      } else {
        setStatus({ sending: false, success: false });
      }
    } catch {
      setStatus({ sending: false, success: false });
    }
  };

  if (status.success) {
    return <p className={styles.newsletterSuccess}>{successMessage}</p>;
  }

  return (
    <form
      className={styles.newsletterForm}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.newsletterFormMain}>
        <div className={styles.newsletterFields}>
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
              .
            </>
          }
          register={register('legal', {
            required: { value: true, message: 'Zgoda jest wymagana' },
          })}
          errors={errors}
          className={styles.newsletterCheckbox}
        />
      </div>

      <Button
        type='submit'
        className={styles.newsletterSubmit}
        disabled={status.sending}
      >
        {status.sending ? 'Zapisywanie...' : buttonLabel || defaultButtonLabel}
      </Button>

      {status.success === false && <p className={styles.newsletterError}>{errorMessage}</p>}
    </form>
  );
};

export default NewsletterItemForm;
