import Input from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import styles from './Checkout.module.scss';
import Checkbox from '@/components/ui/Checkbox';
import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import type { InputState, MappingProps } from './Checkout.types';

type FormValues = {
  fullName?: string;
  email: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phoneNumber?: string;

  shippingFullName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
  shippingZipCode?: string;

  nip?: string;
  companyName?: string;

  shippingSameAsBilling: boolean;

  invoiceType: 'Osoba prywatna' | 'Firma';
  shippingMethod?: string;
};

const generateNewInput = (data: FormValues, input: InputState) => {
  return {
    ...input,
    firmOrder: data.invoiceType === 'Firma',
    billingDifferentThanShipping: !data.shippingSameAsBilling,
    shipping: {
      firstName: data.shippingFullName,
      address1: data.shippingAddress,
      city: data.shippingCity,
      country: data.shippingCountry,
      postcode: data.shippingZipCode,
      email: data.email,
      phone: data.phoneNumber,
      company: data.companyName,
    },
    billing: {
      nip: data.nip,
      firstName: data.fullName,
      address1: data.address,
      city: data.city,
      country: data.country,
      postcode: data.zipCode,
      email: data.email,
      phone: data.phoneNumber,
      company: data.companyName,
    },
  };
};

const generateDefaults = (input: InputState) => {
  return {
    fullName: input.billing.firstName,
    email: input.billing.email,
    address: input.billing.address1,
    city: input.billing.city,
    country: input.billing.country,
    zipCode: input.billing.postcode,
    phoneNumber: input.billing.phone,

    shippingFullName: input.shipping.firstName,
    shippingAddress: input.shipping.address1,
    shippingCity: input.shipping.city,
    shippingCountry: input.shipping.country,
    shippingZipCode: input.shipping.postcode,

    nip: input.billing.nip,
    companyName: input.billing.company,

    shippingSameAsBilling: input.shippingSameAsBilling,

    firmOrder: input.firmOrder ? 'Firma' : 'Osoba prywatna',
  };
};

export default function PersonalData({ nextStep, setInput, input }: MappingProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'all', defaultValues: generateDefaults(input) });

  const onSubmit = handleSubmit((data) => {
    const newInput = generateNewInput(data, input);
    setInput(newInput as InputState);
    nextStep();
  });

  const shippingSameAsBilling = watch('shippingSameAsBilling');

  useEffect(() => {
    setValue('shippingFullName', watch('fullName'));
    setValue('shippingAddress', watch('address'));
    setValue('shippingCity', watch('city'));
    setValue('shippingZipCode', watch('zipCode'));
    setValue('shippingCountry', watch('country'));
  }, [shippingSameAsBilling, setValue, watch]);

  return (
    <form onSubmit={onSubmit}>
      <legend>Wybierz sposób dostawy</legend>
      {/*  */}
      {/*  */}
      <legend>Dane do faktury</legend>
      <fieldset>
        <Input
          register={register('fullName', {
            required: {
              value: true,
              message: 'Pole wymagane',
            },
          })}
          label='Imię i nazwisko'
          errors={errors}
        />
        <Input
          register={register('email', {
            required: {
              value: true,
              message: 'Pole wymagane',
            },
          })}
          label='Email'
          errors={errors}
        />
        <Input
          register={register('address', {
            required: {
              value: true,
              message: 'Pole wymagane',
            },
          })}
          label='Adres'
          errors={errors}
        />
        <div className={styles['zip']}>
          <Input
            register={register('zipCode', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
            })}
            label='Kod pocztowy'
            errors={errors}
          />
          <Input
            register={register('city', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
            })}
            label='Miasto'
            errors={errors}
          />
        </div>
        <Input
          register={register('country', {
            required: {
              value: true,
              message: 'Pole wymagane',
            },
          })}
          label='Kraj'
          errors={errors}
        />
        <Input
          register={register('phoneNumber')}
          label='Numer telefonu (opcjonalnie)'
          errors={errors}
        />
      </fieldset>
      <legend>Adres dostawy</legend>
      <fieldset>
        <Checkbox
          register={register('shippingSameAsBilling')}
          label='Adres dostawy taki sam jak adres do faktury'
          errors={errors}
        />
        <Input
          register={register('shippingFullName')}
          label='Imię i nazwisko'
          errors={errors}
          readOnly={shippingSameAsBilling}
          tabIndex={shippingSameAsBilling ? -1 : 0}
        />
        <Input
          register={register('shippingAddress')}
          label='Adres'
          errors={errors}
          readOnly={shippingSameAsBilling}
          tabIndex={shippingSameAsBilling ? -1 : 0}
        />
        <div className={styles['zip']}>
          <Input
            register={register('shippingZipCode')}
            label='Kod pocztowy'
            errors={errors}
            readOnly={shippingSameAsBilling}
            tabIndex={shippingSameAsBilling ? -1 : 0}
          />
          <Input
            register={register('shippingCity')}
            label='Miasto'
            errors={errors}
            readOnly={shippingSameAsBilling}
            tabIndex={shippingSameAsBilling ? -1 : 0}
          />
        </div>
        <Input
          register={register('shippingCountry')}
          label='Kraj'
          errors={errors}
          readOnly={shippingSameAsBilling}
          tabIndex={shippingSameAsBilling ? -1 : 0}
        />
      </fieldset>
      <div className={styles.buttons}>
        <button
          className={`link ${styles['return']}`}
          type='button'
        >
          Wróć do koszyka
        </button>
        <Button onClick={nextStep} type='button'>Przechodzę dalej</Button>
      </div>
    </form>
  );
}
