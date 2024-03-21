import type { InputState, Props, MappingProps } from './Checkout.types';
import styles from './Checkout.module.scss';
import SummaryAside from './_SummaryAside';
import PersonalData from './_PersonalData';
import { useEffect, useState } from 'react';
import Authorization from './_Authorization';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Payment from './_Payment';

const stepContent = (props: MappingProps) => ({
  1: <PersonalData {...props} />,
  2: <Authorization {...props} />,
  3: <Payment {...props} />,
});

export default function Checkout({ goToCart, fetchedItems, showCheckout, setShowCheckout, CrossIcon }: Props) {
  const supabase = createClientComponentClient();
  const [step, setStep] = useState(1);

  const [input, setInput] = useState<InputState>({
    firmOrder: false,
    shippingSameAsBilling: true,
    amount: 0,
    shipping: {
      firstName: 'Tets ',
      address1: 'test',
      city: 'test',
      country: 'PL',
      postcode: '12-123',
      email: 'test@test.tes',
      phone: '123123123',
      company: '',
    },
    billing: {
      nip: '',
      firstName: 'Tets ',
      address1: 'test',
      city: 'test',
      country: 'PL',
      postcode: '12-123',
      email: 'test@test.tes',
      phone: '123123123',
      company: '',
    },
  });

  useEffect(() => {
    if (!fetchedItems?.length) {
      if (input.amount > 0)
        setInput((prev) => ({
          ...prev,
          products: undefined,
          amount: 0,
        }));

      return;
    }

    setInput((prev) => ({
      ...prev,
      amount: fetchedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      products: {
        array: fetchedItems.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.variants?.[0]?.gallery?.[0] ? item.variants[0].gallery[0] : item.gallery,
        })),
      },
    }));
  }, [fetchedItems, input.amount, setInput]);

  useEffect(() => {
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setShowCheckout();
    });

    return () => removeEventListener('keydown', () => setShowCheckout());
  }, [setShowCheckout]);

  const nextStep = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && (!input.user_id || input.user_id !== user.id)) {
      setInput({ ...input, user_id: user.id });
    }

    let nextStep = step + 1;
    if (nextStep === 2 && user) nextStep++;

    setStep(nextStep);
  };

  const prevStep = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && (!input.user_id || input.user_id !== user.id)) {
      setInput({ ...input, user_id: user.id });
    }

    let nextStep = step - 1;
    if (nextStep === 2 && user) nextStep--;

    setStep(nextStep);
  };

  return (
    <>
      <div className={`${styles['checkout']} ${showCheckout ? styles['active'] : ''}`}>
        <button
          className={styles['close']}
          onClick={setShowCheckout}
        >
          {CrossIcon}
        </button>
        <div className={styles['content']}>
          <div className={styles['main']}>
            {stepContent({ goToCart, nextStep, setStep, prevStep, input, setInput })[step as keyof typeof stepContent]}
          </div>
          <SummaryAside input={input} />
        </div>
      </div>
    </>
  );
}
