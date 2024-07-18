'use client';

import styles from './StanVouchera.module.scss';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import type { FormTypes } from './StanVouchera.types';
import { toast } from 'react-toastify';
import { useState } from 'react';

const StanVouchera = () => {
  const [fetching, setFetching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormTypes>({
    mode: 'all',
  });

  const onSubmit: SubmitHandler<FormTypes> = async (data) => {
    setFetching(true);

    await fetch('/api/coupon/get', {
      method: 'POST',
      body: JSON.stringify({ code: data.code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast(data.error);
          return;
        }

        if (data.coupons_types.coupon_type !== 'VOUCHER') {
          toast('Podany kod nie jest kodem vouchera');
          return;
        }

        toast(
          'Pozostała należność: ' + data.voucher_amount_left/100 + ' zł,' + '\n' + 'Data ważności: ' + data.expiration_date
        );
      })
      .catch((error) => {
        toast(error.message);
      })
      .finally(() => setFetching(false));
  };

  return (
    <section className={styles['StanVouchera']}>
      <h1>
        Sprawdź stan konta swojego <strong>vouchera upominkowego</strong>
      </h1>
      <p>
        Wpisz <strong>kod vouchera</strong> podany na karcie, aby dowiedzieć się o jego stanie i dacie ważności.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          register={register('code', {
            required: {
              value: true,
              message: 'Pole wymagane',
            },
          })}
          label='Kod vouchera'
          errors={errors}
        />
        <Button disabled={fetching}>Stan konta</Button>
      </form>
    </section>
  );
};

export default StanVouchera;
