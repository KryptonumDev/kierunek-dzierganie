'use client';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import { REGEX } from '@/global/constants';
import type { ProductCard } from '@/global/types';
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

export default function Authorization({
  setStep,
  goToCart,
  setInput,
  fetchedItems,
}: MappingProps & { fetchedItems: ProductCard[] | null }) {
  const [isRegister, setRegister] = useState(true);
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

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (isRegister) {
      await supabase.auth
        .signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${location.origin}/api/auth/confirm`,
          },
        })
        .then(async (res) => {
          if (res.error) throw res.error;

          if (res.data.user) {
            const { data } = await supabase
              .from('profiles')
              .select(
                `
                id,
                billing_data,
                shipping_data
              `
              )
              .eq('id', res.data.user!.id)
              .single();

            setInput((prev: InputState) => {
              return {
                ...prev,
                user_id: res.data.user!.id,
                shipping: {
                  firstName: data!.shipping_data?.firstName ?? '',
                  address1: data!.shipping_data?.address1 ?? '',
                  city: data!.shipping_data?.city ?? '',
                  country: data!.shipping_data?.country ?? '',
                  postcode: data!.shipping_data?.postcode ?? '',
                  phone: data!.shipping_data?.phone ?? '',
                },
                billing: {
                  nip: data!.billing_data?.nip ?? '',
                  firstName: data!.billing_data?.firstName ?? '',
                  address1: data!.billing_data?.address1 ?? '',
                  city: data!.billing_data?.city ?? '',
                  country: data!.billing_data?.country ?? '',
                  postcode: data!.billing_data?.postcode ?? '',
                  email: res.data.user?.email ?? '',
                  phone: data!.billing_data?.phone ?? '',
                  company: data!.billing_data?.company ?? '',
                  invoiceType: data!.billing_data?.invoiceType ?? 'Osoba prywatna',
                },
              };
            });

            if (!res.data.session) {
              toast('Na podany adres e-mail został wysłany link aktywacyjny');
            }

            setStep(2);
            return;
          }
        })
        .catch((error) => {
          toast(error.message);
          console.error(error);
        });
    } else {
      await supabase.auth
        .signInWithPassword({
          email: data.email,
          password: data.password,
        })
        .then(async (res) => {
          if (res.error) throw res.error;

          const { data } = await supabase
            .from('profiles')
            .select(
              `
              id,
              billing_data,
              shipping_data
            `
            )
            .eq('id', res.data.user!.id)
            .single();

          setInput((prev: InputState) => {
            return {
              ...prev,
              user_id: res.data.user!.id,
              shipping: {
                firstName: data!.shipping_data?.firstName ?? '',
                address1: data!.shipping_data?.address1 ?? '',
                city: data!.shipping_data?.city ?? '',
                country: data!.shipping_data?.country ?? '',
                postcode: data!.shipping_data?.postcode ?? '',
                phone: data!.shipping_data?.phone ?? '',
              },
              billing: {
                nip: data!.billing_data?.nip ?? '',
                firstName: data!.billing_data?.firstName ?? '',
                address1: data!.billing_data?.address1 ?? '',
                city: data!.billing_data?.city ?? '',
                country: data!.billing_data?.country ?? '',
                postcode: data!.billing_data?.postcode ?? '',
                email: res.data.user?.email ?? '',
                phone: data!.billing_data?.phone ?? '',
                company: data!.billing_data?.company ?? '',
                invoiceType: data!.billing_data?.invoiceType ?? 'Osoba prywatna',
              },
            };
          });
          setStep(2);
          router.refresh();
        })
        .catch((error) => {
          toast(error.message);
          console.error(error);
        });
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
        <Button>{isRegister ? 'Zarejestruj się' : 'Zaloguj się'}</Button>

        {/* Guest Checkout Option - Only show for physical-only carts */}
        {cartValidation.canCheckoutAsGuest && (
          <div className={styles['guest-checkout']}>
            <div className={styles['divider']}>
              <span>lub</span>
            </div>
            <Button
              type='button'
              onClick={handleGuestCheckout}
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
        >
          Wróć do koszyka
        </button>
      </div>
    </>
  );
}
