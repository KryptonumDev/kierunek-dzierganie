'use client';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { REGEX } from '@/global/constants';
import type { ProductCard } from '@/global/types';
import { checkAccountExists } from '@/utils/check-account-exists';
import { normalizeEmail } from '@/utils/normalize-email';
import { createClient } from '@/utils/supabase-client';
import {
  validateGuestCart,
  getGuestCheckoutBlockedMessage,
  type CartValidationResult,
} from '@/utils/validate-guest-cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styles from './Checkout.module.scss';
import type { InputState, MappingProps } from './Checkout.types';
// import OAuthMethods from "@/components/organisms/oAuth-methods";

type FormValues = {
  email: string;
  password: string;
  accept: boolean;
};

type ProfileData = {
  billing_data?: Partial<InputState['billing']> | null;
  shipping_data?: Partial<InputState['shipping']> | null;
};

const EXISTING_ACCOUNT_MESSAGE = 'Konto z tym adresem e-mail już istnieje. Zaloguj się lub ustaw hasło.';
const SIGNUP_RECOVERY_MESSAGE =
  'Nie udało się dokończyć rejestracji. Jeśli konto już istnieje, zaloguj się lub ustaw hasło.';
const PROFILE_LOAD_ERROR_MESSAGE = 'Nie udało się pobrać danych konta. Spróbuj ponownie.';

const getAuthErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Wystąpił błąd. Spróbuj ponownie.';

  if (message === 'Invalid login credentials') {
    return 'Nieprawidłowe dane logowania!';
  }

  if (
    message === 'User already registered' ||
    message.toLowerCase().includes('user_already_exists') ||
    (message.toLowerCase().includes('already') && message.toLowerCase().includes('exist'))
  ) {
    return EXISTING_ACCOUNT_MESSAGE;
  }

  return message;
};

export default function Authorization({
  setStep,
  goToCart,
  setInput,
  fetchedItems,
}: MappingProps & { fetchedItems: ProductCard[] | null }) {
  const [isRegister, setRegister] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Validate cart for guest checkout eligibility
  const cartValidation = useMemo((): CartValidationResult => {
    if (!fetchedItems) return validateGuestCart([]);
    return validateGuestCart(fetchedItems);
  }, [fetchedItems]);

  const handleGuestCheckout = () => {
    if (!cartValidation.canCheckoutAsGuest) {
      toast.error(getGuestCheckoutBlockedMessage(cartValidation));
      return;
    }

    // Set guest checkout flag in input state
    setInput((prev: InputState) => ({
      ...prev,
      isGuestCheckout: true,
      user_id: undefined, // Ensure no user_id for guest checkout
      billing: {
        ...prev.billing,
        email: '', // Reset email for guest to enter
      },
    }));

    // Skip to step 2 (Personal Data)
    setStep(2);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
  });

  const updateInputFromProfile = (userId: string, email: string, profile: ProfileData) => {
    setInput((prev: InputState) => {
      return {
        ...prev,
        user_id: userId,
        shipping: {
          firstName: profile.shipping_data?.firstName ?? '',
          address1: profile.shipping_data?.address1 ?? '',
          city: profile.shipping_data?.city ?? '',
          country: profile.shipping_data?.country ?? '',
          postcode: profile.shipping_data?.postcode ?? '',
          phone: profile.shipping_data?.phone ?? '',
        },
        billing: {
          nip: profile.billing_data?.nip ?? '',
          firstName: profile.billing_data?.firstName ?? '',
          address1: profile.billing_data?.address1 ?? '',
          city: profile.billing_data?.city ?? '',
          country: profile.billing_data?.country ?? '',
          postcode: profile.billing_data?.postcode ?? '',
          email,
          phone: profile.billing_data?.phone ?? '',
          company: profile.billing_data?.company ?? '',
          invoiceType: profile.billing_data?.invoiceType ?? 'Osoba prywatna',
        },
      };
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const { exists, normalizedEmail } = await checkAccountExists(data.email);

        if (exists) {
          toast(EXISTING_ACCOUNT_MESSAGE);
          setRegister(false);
          return;
        }

        const res = await supabase.auth.signUp({
          email: normalizedEmail,
          password: data.password,
          options: {
            emailRedirectTo: `${location.origin}/api/auth/confirm`,
          },
        });

        if (res.error) {
          throw res.error;
        }

        if (!res.data.user) {
          toast(SIGNUP_RECOVERY_MESSAGE);
          setRegister(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(
            `
              id,
              billing_data,
              shipping_data
            `
          )
          .eq('id', res.data.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          toast(SIGNUP_RECOVERY_MESSAGE);
          setRegister(false);
          return;
        }

        updateInputFromProfile(res.data.user.id, res.data.user.email ?? normalizedEmail, profile);

        if (!res.data.session) {
          toast('Na podany adres e-mail został wysłany link aktywacyjny');
        }

        setStep(2);
        return;
      }

      const normalizedEmail = normalizeEmail(data.email);
      const res = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: data.password,
      });

      if (res.error) {
        throw res.error;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(
          `
            id,
            billing_data,
            shipping_data
          `
        )
        .eq('id', res.data.user!.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        toast(PROFILE_LOAD_ERROR_MESSAGE);
        return;
      }

      updateInputFromProfile(res.data.user!.id, res.data.user?.email ?? normalizedEmail, profile);
      setStep(2);
      router.refresh();
    } catch (error) {
      toast(getAuthErrorMessage(error));
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
                i 
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
            errors={errors}
          />
        )}
        <Button disabled={isSubmitting}>{isRegister ? 'Zarejestruj się' : 'Zaloguj się'}</Button>

        {/* Guest Checkout Option - Only show for physical-only carts */}
        {cartValidation.canCheckoutAsGuest && (
          <div className={styles['guest-checkout']}>
            <div className={styles['divider']}>
              <span>lub</span>
            </div>
            <Button
              type='button'
              onClick={handleGuestCheckout}
              disabled={isSubmitting}
            >
              Kontynuuj jako gość
            </Button>
            <p className={styles['guest-info']}>Zakup bez tworzenia konta. Dotyczy tylko produktów fizycznych.</p>
          </div>
        )}

        {isRegister ? (
          <p>
            Masz już konto?{' '}
            <button
              className='link'
              onClick={() => {
                setRegister(false);
              }}
              type='button'
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
          disabled={isSubmitting}
        >
          Wróć do koszyka
        </button>
      </div>
    </>
  );
}
