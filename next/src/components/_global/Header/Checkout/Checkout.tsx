import type { Billing, Shipping, ProductCard } from '@/global/types';
import { getProductBasis } from '@/utils/get-product-basis';
import { validateGuestCart } from '@/utils/validate-guest-cart';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Checkout.module.scss';
import type { InputState, MappingProps, Props } from './Checkout.types';
import Authorization from './_Authorization';
import PersonalData from './_PersonalData';
import SummaryAside from './_SummaryAside';

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

const stepContent = (props: MappingProps, fetchedItems: ProductCard[] | null) => ({
  1: (
    <Authorization
      {...props}
      fetchedItems={fetchedItems}
    />
  ),
  2: <PersonalData {...props} />, //
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
  shippingMethods,
  currentShippingMethod,
  setCurrentShippingMethod,
  // virtualWallet,
}: Props) {
  const [step, setStep] = useState(1);

  const [input, setInput] = useState<InputState>(createInputState(billing, shipping, userEmail));

  useEffect(() => {
    if (userEmail) setStep(2);
  }, [userEmail]);

  useEffect(
    () => {
      if (!fetchedItems?.length) {
        if (input.amount > 0)
          setInput((prev) => ({
            ...prev,
            products: undefined,
            amount: 0,
          }));

        return;
      }

      // Validate cart for guest checkout eligibility
      const cartValidation = validateGuestCart(fetchedItems);

      setInput((prev) => {
        // Reset guest checkout state if cart becomes ineligible
        const shouldResetGuestCheckout = prev.isGuestCheckout && !cartValidation.canCheckoutAsGuest;

        // Show notification when guest checkout is reset
        if (shouldResetGuestCheckout) {
          toast.error('Dodano produkty cyfrowe - wymagane jest założenie konta lub zalogowanie się');
        }

        return {
          ...prev,
          // Reset guest checkout flag if cart is no longer eligible
          isGuestCheckout: shouldResetGuestCheckout ? undefined : prev.isGuestCheckout,
          amount: fetchedItems.reduce((acc, item) => acc + (item.discount ?? item.price! * item.quantity!), 0),
          needDelivery: fetchedItems.some((item) => item.needDelivery),
          delivery: fetchedItems.some((item) => item.needDelivery)
            ? Number(shippingMethods.find((method) => method.name === currentShippingMethod)?.price)
            : 0,
          freeDelivery:
            freeShipping > 0 &&
            fetchedItems.reduce((acc, item) => acc + (item.discount ?? item.price! * item.quantity!), 0) >=
              freeShipping,
          discount: usedDiscount?.affiliatedBy === userId ? null : usedDiscount,
          virtualMoney: usedVirtualMoney,
          products: {
            array: fetchedItems.map((item) => {
              const basis = getProductBasis(item.basis, item._type);

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
                    : (item.courses ?? null),
                variantId: item.variant?._id,
                type: item._type,
                voucherData: item.voucherData,
                basis: item.basis,
              };
            }),
          },
        };
      });

      // Reset to step 1 if guest checkout was disabled due to cart changes
      if (input.isGuestCheckout && !cartValidation.canCheckoutAsGuest && step === 2) {
        setStep(1);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      fetchedItems,
      input.amount,
      input.isGuestCheckout,
      step,
      setInput,
      usedDiscount,
      usedVirtualMoney,
      setUsedDiscount,
      deliverySettings,
    ]
  );

  console.log(input.products?.array);

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
          {
            stepContent(
              {
                goToCart,
                setStep,
                input,
                setInput,
                deliverySettings,
                shippingMethods,
                currentShippingMethod,
                setCurrentShippingMethod,
              },
              fetchedItems
            )[step as keyof typeof stepContent]
          }
          <SummaryAside input={input} />
        </div>
      </div>
    </>
  );
}
