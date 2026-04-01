'use client';

import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import { mailerLiteGroup, REGEX } from '@/global/constants';
import type { ImgType } from '@/global/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './PostPurchaseHero.module.scss';

type NewsletterSectionProps = {
  groupId: string | null;
  image: ImgType | null;
  previewMode?: boolean;
};

type FormValues = {
  name: string;
  email: string;
  legal: boolean;
};

const NewsletterSection = ({ groupId, image, previewMode = false }: NewsletterSectionProps) => {
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const onSubmit = async (data: FormValues) => {
    if (previewMode) {
      setState('success');
      return;
    }

    setSending(true);
    setState('idle');

    try {
      const response = await fetch('/api/mailerlite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          groupID: groupId || mailerLiteGroup.newsletter,
        }),
      });
      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setState('success');
        reset();
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`${styles.newsletterLayout} ${image ? styles.newsletterLayoutWithImage : styles.newsletterLayoutSingle}`}>
      {image && (
        <div className={styles.newsletterMedia}>
          <Img
            data={image}
            className={styles.newsletterImage}
            sizes='(max-width: 767px) 100vw, (max-width: 1199px) 45vw, 420px'
          />
        </div>
      )}

      <aside className={styles.newsletterCard}>
        {!previewMode && state === 'success' ? (
          <p className={styles.newsletterSuccess}>
            Dziękujemy! Sprawdź swoją skrzynkę mailową, tam trafi darmowy produkt po zapisie do newslettera.
          </p>
        ) : (
          <>
            <form
              className={styles.newsletterForm}
              onSubmit={handleSubmit(onSubmit)}
            >
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
              />

              <Button
                type='submit'
                className={styles.newsletterButton}
                disabled={sending}
              >
                {sending ? 'Zapisywanie...' : 'Odbieram gratis'}
              </Button>

              {!previewMode && state === 'error' && (
                <p className={styles.newsletterError}>Wystąpił błąd przy zapisie. Spróbuj ponownie.</p>
              )}
            </form>

            {previewMode && state === 'success' && (
              <p className={styles.newsletterSuccess}>
                Podgląd wysłany lokalnie. Po publikacji formularz zapisze użytkownika do wskazanej grupy MailerLite.
              </p>
            )}
          </>
        )}
      </aside>
    </div>
  );
};

export default NewsletterSection;
