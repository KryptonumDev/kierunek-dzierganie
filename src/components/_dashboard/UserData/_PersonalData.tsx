import { useForm } from 'react-hook-form';
import styles from './UserData.module.scss';
import type { PersonalDataFormTypes, PersonalDataTypes } from './UserData.types';
import Input from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import countryList from 'react-select-country-list';
import Radio from '@/components/ui/Radio';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import Select from '@/components/ui/Select';

export default function PersonalData({ billing_data, id }: PersonalDataTypes) {
  const supabase = createClientComponentClient();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalDataFormTypes>({
    mode: 'all',
    defaultValues: {
      firstName: billing_data.firstName,
      address: billing_data.address,
      postcode: billing_data.postcode,
      city: billing_data.city,
      country: billing_data.country,
      phone: billing_data.phone,
      invoiceType: billing_data.invoiceType ?? 'Osoba prywatna',

      company: billing_data.company,
      nip: billing_data.nip,
    },
  });

  const onSubmit = async (data: PersonalDataFormTypes) => {
    const res = await supabase.from('profiles').update({ billing_data: data }).eq('id', id);

    if (res.error) {
      toast.error('Wystąpił błąd podczas zapisywania danych');
    }

    toast.success('Dane zostały zapisane');
  };

  const invoiceType = watch('invoiceType');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['personal-data']}
    >
      <div className={styles['invoiceType']}>
        <Radio
          register={register('invoiceType')}
          value={'Osoba prywatna'}
          label='Osoba prywatna'
          errors={errors}
        />
        <Radio
          register={register('invoiceType')}
          value={'Firma'}
          label='Firma'
          errors={errors}
        />
      </div>
      {invoiceType === 'Firma' ? (
        <>
          <Input
            register={register('company', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
            })}
            label='Nazwa firmy'
            errors={errors}
          />
          <Input
            register={register('nip', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
            })}
            label='NIP'
            errors={errors}
          />
        </>
      ) : (
        <Input
          register={register('firstName', {
            required: {
              value: true,
              message: 'Pole wymagane',
            },
          })}
          label='Imię i nazwisko'
          errors={errors}
        />
      )}
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
          register={register('postcode', {
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
      <Select<PersonalDataFormTypes>
        control={control}
        name={'country'}
        rules={{ required: 'Pole wymagane' }}
        label='Kraj'
        errors={errors}
        options={countryList().native().nativeData}
      />
      <Input
        register={register('phone')}
        label='Numer telefonu (opcjonalnie)'
        errors={errors}
      />
      <Button type='submit'>Zapisz zmiany</Button>
    </form>
  );
}
