import type { Billing, CourseGrantLink, ProductCard, Shipping } from '@/global/types';
import { getProductBasis } from '@/utils/get-product-basis';
import {
  resolveProductCardsShippingInfo,
  shippingModeChargesDelivery,
  shippingModeRequiresDelivery,
} from '@/utils/resolve-shipping-mode';
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
  shippingMode: 'none' as const,
  client_notes: '',
  freeDelivery: false,
  shipping: {
    firstName: shipping?.firstName ?? '',
    address1: shipping?.address1 ?? '',
    city: shipping?.city ?? '',
    country: 'PL', // Hardcoded to Poland
    postcode: shipping?.postcode ?? '',
    phone: shipping?.phone ?? '',
  },
  billing: {
    nip: billing?.nip ?? '',
    firstName: billing?.firstName ?? '',
    address1: billing?.address1 ?? '',
    city: billing?.city ?? '',
    country: 'PL', // Hardcoded to Poland
    postcode: billing?.postcode ?? '',
    email: userEmail ?? '',
    phone: billing?.phone ?? '',
    company: billing?.company ?? '',
    invoiceType: billing?.invoiceType ?? 'Osoba prywatna',
  },
});

const getGrantedCourseLinks = (item: ProductCard): CourseGrantLink[] | null => {
  if (item._type === 'bundle') {
    return item.courses ?? null;
  }

  if (item._type !== 'course') {
    return null;
  }

  const deduplicatedCourses = new Map<string, CourseGrantLink>();

  [
    {
      _id: item._id,
      automatizationId: item.automatizationId,
      previewGroupMailerLite: item.previewGroupMailerLite,
      accessMode: item.accessMode,
      accessFixedDate: item.accessFixedDate,
    },
    ...(item.grantedCourses ?? []),
  ].forEach((course) => {
    if (!course?._id || deduplicatedCourses.has(course._id)) return;
    deduplicatedCourses.set(course._id, course);
  });

  return Array.from(deduplicatedCourses.values());
};

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
  usedDiscounts,
  usedVirtualMoney,
  userId,
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
        if (input.amount > 0 || input.needDelivery || input.products)
          setInput((prev) => ({
            ...prev,
            products: undefined,
            amount: 0,
            delivery: 0,
            freeDelivery: false,
            needDelivery: false,
            shippingMode: 'none',
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
          toast.error('Dodano kurs, pakiet lub voucher wymagający konta - zaloguj się lub utwórz konto');
        }

        const newAmount = fetchedItems.reduce((acc, item) => acc + (item.discount ?? item.price! * item.quantity!), 0);
        const resolvedShippingInfo = resolveProductCardsShippingInfo(fetchedItems);
        const needsDelivery = shippingModeRequiresDelivery(resolvedShippingInfo.mode);
        const chargesDelivery = shippingModeChargesDelivery(resolvedShippingInfo.mode);
        const selectedShippingMethodPrice = Number(
          shippingMethods.find((method) => method.name === currentShippingMethod)?.price
        );
        const qualifiesForFreeDelivery = chargesDelivery && freeShipping > 0 && newAmount >= freeShipping;
        const deliveryAmount = chargesDelivery && !qualifiesForFreeDelivery ? selectedShippingMethodPrice : 0;

        return {
          ...prev,
          user_id: prev.user_id || userId,
          // Reset guest checkout flag if cart is no longer eligible
          isGuestCheckout: shouldResetGuestCheckout ? undefined : prev.isGuestCheckout,
          amount: newAmount,
          needDelivery: needsDelivery,
          shippingMode: resolvedShippingInfo.mode,
          delivery: needsDelivery ? deliveryAmount : 0,
          freeDelivery: needsDelivery ? qualifiesForFreeDelivery : false,
          // Legacy single discount retained for old flows; new array provided in parallel
          discount:
            usedDiscounts.length === 1 && usedDiscounts[0]?.affiliatedBy === userId ? null : (usedDiscounts[0] ?? null),
          discounts: usedDiscounts,
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
                courses: getGrantedCourseLinks(item),
                variantId: item.variant?._id,
                type: item._type,
                voucherData: item.voucherData,
                basis: item.basis,
                automatizationId: item.automatizationId, // Add automatizationId for all product types
                shipmentRequired: item.needDelivery,
                shipmentMode: item.shippingMode ?? 'none',
                shipmentSource: item._type,
                shipmentLabel: item.shippingLabel ?? null,
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
      currentShippingMethod,
      freeShipping,
      shippingMethods,
      step,
      setInput,
      usedDiscounts,
      usedVirtualMoney,
      userId,
    ]
  );

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
