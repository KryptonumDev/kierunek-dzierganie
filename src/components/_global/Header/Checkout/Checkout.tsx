import type { InputState, Props, MappingProps } from './Checkout.types';
import styles from './Checkout.module.scss';
import SummaryAside from './_SummaryAside';
import PersonalData from './_PersonalData';
import { useEffect, useState } from 'react';
import Authorization from './_Authorization';

const stepContent = (props: MappingProps) => ({
  1: <Authorization {...props} />,
  2: <PersonalData {...props} />,
});

export default function Checkout({
  goToCart,
  fetchedItems,
  showCheckout,
  setShowCheckout,
  CrossIcon,
  userEmail,
  billing,
  shipping,
  // virtualWallet,
}: Props) {
  const [step, setStep] = useState(1);

  const [input, setInput] = useState<InputState>({
    firmOrder: false,
    shippingSameAsBilling: true,
    amount: 0,
    needDelivery: false,
    shipping: {
      firstName: shipping?.firstName ?? '',
      address1: shipping?.address1 ?? '',
      city: shipping?.city ?? '',
      country: shipping?.country ?? '',
      postcode: shipping?.postcode ?? '',
      phone: shipping?.phone ?? '',
    },
    billing: {
      nip: billing?.nip ?? '',
      firstName: billing?.firstName ?? '',
      address1: billing?.address1 ?? '',
      city: billing?.city ?? '',
      country: billing?.country ?? '',
      postcode: billing?.postcode ?? '',
      email: userEmail ?? '',
      phone: billing?.phone ?? '',
      company: billing?.company ?? '',
      invoiceType: billing?.invoiceType ?? 'Osoba prywatna',
    },
  });

  useEffect(() => {
    if (userEmail) setStep(2);
  }, []);

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
          image: item.variants?.[0]?.gallery ? item.variants[0].gallery : item.gallery,
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
