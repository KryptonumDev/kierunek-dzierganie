import type { InputState, Props, MappingProps } from './Checkout.types';
import styles from './Checkout.module.scss';
import SummaryAside from './_SummaryAside';
import PersonalData from './_PersonalData';
import { useEffect, useState } from 'react';
import Authorization from './_Authorization';
import type { Billing, Shipping } from '@/global/types';

const createInputState = (billing?: Billing, shipping?: Shipping, userEmail?: string) => ({
  firmOrder: false,
  shippingSameAsBilling: true,
  delivery: 0,
  amount: 0,
  totalAmount: 0,
  needDelivery: false,
  client_notes: '',
  freeDelivery: false,
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

const stepContent = (props: MappingProps) => ({
  1: <Authorization {...props} />,
  2: <PersonalData {...props} />,
});

export default function Checkout({
  goToCart,
  fetchedItems,
  showCheckout,
  setShowCheckout,
  NavigationCrossIcon,
  userEmail,
  billing,
  shipping,
  usedDiscount,
  usedVirtualMoney,
  userId,
  setUsedDiscount,
  deliverySettings,
  freeShipping,
  // virtualWallet,
}: Props) {
  const [step, setStep] = useState(1);

  const [input, setInput] = useState<InputState>(createInputState(billing, shipping, userEmail));

  useEffect(() => {
    if (userEmail) setStep(2);
  }, [userEmail]);

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
      amount: fetchedItems.reduce((acc, item) => acc + (item.discount ?? item.price! * item.quantity!), 0),
      needDelivery: fetchedItems.some((item) => item.needDelivery),
      delivery: fetchedItems.some((item) => item.needDelivery) ? Number(deliverySettings?.deliveryPrice) : 0,
      freeDelivery:
        freeShipping > 0 &&
        fetchedItems.reduce((acc, item) => acc + (item.discount ?? item.price! * item.quantity!), 0) >= freeShipping,
      discount: usedDiscount?.affiliatedBy === userId ? null : usedDiscount,
      virtualMoney: usedVirtualMoney,
      user_id: userId,
      products: {
        array: fetchedItems.map((item) => {
          let basis = '';

          if (item.basis === 'crocheting') {
            if (item._type === 'product') basis = '/produkty-do-szydelkowania';
            else basis = '/kursy-szydelkowania';
          } else if (item.basis === 'knitting') {
            if (item._type === 'product') basis = '/produkty-do-dziergania';
            else basis = '/kursy-dziergania-na-drutach';
          }
          return {
            url: 'https://kierunekdzierganie.pl' + basis + '/' + item.slug,
            id: item._id,
            name: item.name + (item.variant?.name ? ` - ${item.variant.name}` : ''),
            price: item.price!,
            discount: item.discount!,
            quantity: item.quantity!,
            image: item.variants?.[0]?.gallery ? item.variants[0].gallery : item.gallery!,
            complexity: item.complexity || null,
            courses:
              item._type === 'course'
                ? [{ _id: item._id, automatizationId: item.automatizationId }]
                : item.courses ?? null,
            variantId: item.variant?._id,
            type: item._type,
            voucherData: item.voucherData,
            basis: item.basis,
          };
        }),
      },
    }));
  }, [fetchedItems, input.amount, setInput, usedDiscount, usedVirtualMoney, userId, setUsedDiscount, deliverySettings]);

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
          {NavigationCrossIcon}
        </button>
        <div className={styles['content']}>
          {stepContent({ goToCart, setStep, input, setInput, deliverySettings })[step as keyof typeof stepContent]}
          <SummaryAside input={input} />
        </div>
      </div>
    </>
  );
}
