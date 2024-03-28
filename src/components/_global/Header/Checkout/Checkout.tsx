import type { InputState, Props, MappingProps } from './Checkout.types';
import styles from './Checkout.module.scss';
import SummaryAside from './_SummaryAside';
import PersonalData from './_PersonalData';
import { useEffect, useState } from 'react';
import Authorization from './_Authorization';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const stepContent = (props: MappingProps) => ({
  1: <Authorization {...props} />,
  2: <PersonalData {...props} />,
});

export default function Checkout({ goToCart, fetchedItems, showCheckout, setShowCheckout, CrossIcon }: Props) {
  const supabase = createClientComponentClient();
  const [step, setStep] = useState(1);

  const [input, setInput] = useState<InputState>({
    firmOrder: false,
    shippingSameAsBilling: true,
    amount: 0,
    needDelivery: false,
    shipping: {
      firstName: '',
      address1: '',
      city: '',
      country: '',
      postcode: '',
      email: '',
      phone: '',
      company: '',
    },
    billing: {
      nip: '',
      firstName: '',
      address1: '',
      city: '',
      country: '',
      postcode: '',
      email: '',
      phone: '',
      company: '',
    },
  });

  useEffect(() => {
    const getInitialStep = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) setStep(2);
    };

    getInitialStep();
  }, [setStep, supabase]);

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
      amount: fetchedItems.reduce((acc, item) => acc + (item.discount ?? item.price * item.quantity), 0),
      needDelivery: fetchedItems.some((item) => item.type === 'physical' || item.type === 'variable'),
      products: {
        array: fetchedItems.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          discount: item.discount,
          quantity: item.quantity!,
          image: item.variants?.[0]?.gallery?.[0] ? item.variants[0].gallery[0] : item.gallery,
          complexity: item.course?.complexity || null,
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

  return (
    <>
      <div
        className={styles['checkout']}
        data-visible={!!showCheckout}
      >
        <button
          className={styles['CloseButton']}
          onClick={setShowCheckout}
        >
          {CrossIcon}
        </button>
        <div className={styles['content']}>
          {stepContent({ goToCart, setStep, input, setInput })[step as keyof typeof stepContent]}
          <SummaryAside input={input} />
        </div>
      </div>
    </>
  );
}
