import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Radio from '@/components/ui/Radio';
import Select from '@/components/ui/Select';
import { REGEX } from '@/global/constants';
import type { MapPoint } from '@/global/types';
import { calculateDiscountAmount } from '@/utils/calculate-discount-amount';
import { formatPrice } from '@/utils/price-formatter';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import countryList from 'react-select-country-list';
import { toast } from 'react-toastify';
import { useCart } from 'react-use-cart';
import styles from './Checkout.module.scss';
import type { FormValues, InputState, MappingProps } from './Checkout.types';

const gtag: Gtag.Gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
};

const generateNewInput = (
  data: FormValues,
  input: InputState,
  selectedMapPoint: MapPoint | null,
  shippingMethods: { name: string; map: boolean; price: number }[]
) => {
  return {
    ...input,
    firmOrder: data.invoiceType === 'Firma',
    billingDifferentThanShipping: !data.shippingSameAsBilling,
    shippingMethod: {
      name: data.shippingMethod,
      price: shippingMethods.find((method) => method.name === data.shippingMethod)?.price || 0,
      data: shippingMethods.find((method) => method.name === data.shippingMethod)?.map ? selectedMapPoint : '',
    },
    totalAmount:
      input.amount +
      (input.discount
        ? calculateDiscountAmount(
            input.amount,
            input.discount,
            shippingMethods.find((method) => method.name === data.shippingMethod)?.price
          )
        : 0) -
      (input.virtualMoney ? input.virtualMoney * 100 : 0) +
      (input.needDelivery && !input.freeDelivery ? Number(input.delivery) : 0),
    client_notes: data.client_notes,
    freeDelivery: input.freeDelivery,
    shipping: {
      firstName: data.shippingSameAsBilling ? data.fullName : data.shippingFullName,
      address1: data.shippingSameAsBilling ? data.address : data.shippingAddress,
      city: data.shippingSameAsBilling ? data.city : data.shippingCity,
      country: data.shippingSameAsBilling ? data.country : data.shippingCountry,
      postcode: data.shippingSameAsBilling ? data.zipCode : data.shippingZipCode,
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
      invoiceType: data.invoiceType,
    },
  };
};

const generateDefaults = (input: InputState, shippingMethods: { name: string }[]) => {
  return {
    shippingMethod: shippingMethods[0]!.name,

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
    client_notes: input.client_notes,

    nip: input.billing.nip,
    companyName: input.billing.company,

    shippingSameAsBilling: input.shippingSameAsBilling,

    invoiceType: input.firmOrder ? 'Firma' : ('Osoba prywatna' as 'Firma' | 'Osoba prywatna'),
  };
};

export default function PersonalData({
  goToCart,
  setInput,
  input,
  shippingMethods,
  setCurrentShippingMethod,
}: MappingProps) {
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apaczka, setApaczka] = useState(null);
  const { emptyCart } = useCart();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'all', defaultValues: generateDefaults(input, shippingMethods) });

  const shippingMethod = watch('shippingMethod');
  const shippingSameAsBilling = watch('shippingSameAsBilling');

  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      delivery: shippingMethods.find((method) => method.name === shippingMethod)?.price || 0,
    }));
  }, [shippingMethod, setInput, shippingMethods]);

  useEffect(() => {
    setValue('shippingFullName', watch('fullName'));
    setValue('shippingAddress', watch('address'));
    setValue('shippingCity', watch('city'));
    setValue('shippingZipCode', watch('zipCode'));
    setValue('shippingCountry', watch('country'));
  }, [shippingSameAsBilling, setValue, watch]);

  const initApaczka = () => {
    /* key:  */
    const apaczkaMap = new window.ApaczkaMap({
      app_id: process.env.NEXT_PUBLIC_APACZKA_APP_ID,
      onChange: function (record: MapPoint) {
        setSelectedMapPoint(record);
      },
    });
    apaczkaMap.setFilterSupplierAllowed(['INPOST']);

    setApaczka(apaczkaMap);
  };

  const invoiceType = watch('invoiceType');

  const shippingMethodd = watch('shippingMethod');

  useEffect(() => {
    if (shippingMethodd) setCurrentShippingMethod(shippingMethodd);
  }, [shippingMethodd, setCurrentShippingMethod]);

  const openApaczka = () => {
    // @ts-expect-error - don't have types for apaczka instance
    apaczka.show({ point: selectedMapPoint });
  };

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    const newInput = generateNewInput(data, input, selectedMapPoint, shippingMethods);

    setInput(newInput as InputState);
    await fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: newInput,
        description: 'Zamówienie w sklepie internetowym Kierunek Dzierganie',
      }),
    })
      .then((res) => res.json())
      .then(({ link }) => {
        if (!link) throw new Error('Błąd podczas tworzenia zamówienia');

        if (typeof fbq !== 'undefined') {
          fbq('track', 'InitiateCheckout', {
            content_ids: newInput.products?.array.map(({ id }) => id),
            contents: newInput.products?.array.map((el) => ({
              id: el.id,
              item_price: el.price! / 100,
              quantity: el.quantity,
            })),
            content_type: 'product',
            value: newInput.totalAmount / 100,
            currency: 'PLN',
          });
        }

        gtag('event', 'begin_checkout', {
          currency: 'PLN',
          value: newInput.totalAmount / 100,
          coupon: newInput.discount?.code,
          // transaction_id: token,
          // shipping: newInput.needDelivery
          //   ? newInput.freeDelivery
          //     ? 0
          //     : newInput.shippingMethod.price / 100
          //   : undefined,
          items: newInput.products?.array.map((el) => ({
            id: el.id,
            name: el.name,
            discount: el.discount ? (el.price! - el.discount) / 100 : undefined,
            price: el.price! / 100,
            item_variant: el.variantId,
            item_category: el.type,
            item_category2: el.basis,
            quantity: el.quantity,
          })),
        });

        emptyCart();
        window.location.href = link;
      })
      .catch((err) => {
        toast('Błąd podczas tworzenia zamówienia');
        console.log(err);
      })
      .finally(() => setSubmitting(false));
  });

  return (
    <>
      <form
        id='hook-form'
        className={styles['main']}
        onSubmit={onSubmit}
      >
        <Script
          onLoad={initApaczka}
          src='https://mapa.apaczka.pl/client/apaczka.map.js'
        />
        {input.needDelivery && (
          <>
            <legend>Wybierz sposób dostawy</legend>
            <fieldset>
              {shippingMethods.map((method) => {
                if (method.map)
                  return (
                    <div
                      data-active={shippingMethod === method.name}
                      data-selected={!!selectedMapPoint}
                      key={method.name}
                      className={styles['map']}
                    >
                      <Radio
                        register={register('shippingMethod', {
                          validate: () =>
                            shippingMethod !== method.name || !!selectedMapPoint || 'Musisz wybrać paczkomat',
                        })}
                        value={method.name}
                        label={`${method.name} <strong>${formatPrice(method.price)}</strong>`}
                        errors={errors}
                      />
                      {shippingMethod === method.name && (
                        <>
                          {selectedMapPoint ? (
                            <div className={styles['inpost-data']}>
                              <p>
                                {selectedMapPoint.street}, {selectedMapPoint.postal_code} {selectedMapPoint.city}
                              </p>
                              <p>Punkt: {selectedMapPoint.foreign_access_point_id}</p>
                              <p>Dostawca: {selectedMapPoint.supplier}</p>
                              <button
                                className='link'
                                type='button'
                                onClick={openApaczka}
                              >
                                Zmień
                              </button>
                            </div>
                          ) : (
                            <button
                              className='link'
                              type='button'
                              onClick={openApaczka}
                            >
                              Wybierz paczkomat
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );

                return (
                  <div
                    data-active={shippingMethod === method.name}
                    key={method.name}
                    className={styles['map']}
                  >
                    <Radio
                      register={register('shippingMethod')}
                      value={method.name}
                      label={`${method.name} <strong>${formatPrice(method.price)}</strong>`}
                      errors={{}}
                    />
                  </div>
                );
              })}
            </fieldset>
          </>
        )}
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
        {/*  */}
        {/*  */}
        <legend>Dane do faktury</legend>
        <fieldset>
          {invoiceType === 'Firma' ? (
            <>
              <Input
                register={register('companyName', {
                  required: {
                    value: true,
                    message: 'Pole wymagane',
                  },
                })}
                label='Firma'
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
              register={register('fullName', {
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
            register={register('email', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
              pattern: {
                value: REGEX.email,
                message: 'Niepoprawny adres email',
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
          <Select<FormValues>
            control={control}
            name={'country'}
            rules={{ required: 'Pole wymagane' }}
            label='Kraj'
            errors={errors}
            options={countryList().native().nativeData}
          />
          <Input
            register={register('phoneNumber', {
              required: {
                value: true,
                message: 'Pole wymagane',
              },
              pattern: {
                value: /^[0-9]{9,11}$/,
                message: 'Niepoprawny numer telefonu',
              },
            })}
            label='Numer telefonu'
            errors={errors}
          />
        </fieldset>
        {input.needDelivery && (
          <>
            <legend>Adres dostawy</legend>
            <fieldset>
              <Checkbox
                register={register('shippingSameAsBilling')}
                label={<>Adres dostawy taki sam jak adres do faktury</>}
                errors={errors}
              />
              {!shippingSameAsBilling && (
                <>
                  <Input
                    register={register('shippingFullName', {
                      required: {
                        value: true,
                        message: 'Pole wymagane',
                      },
                    })}
                    label='Imię i nazwisko'
                    errors={errors}
                    readOnly={shippingSameAsBilling}
                    tabIndex={shippingSameAsBilling ? -1 : 0}
                  />
                  <Input
                    register={register('shippingAddress', {
                      required: {
                        value: true,
                        message: 'Pole wymagane',
                      },
                    })}
                    label='Adres'
                    errors={errors}
                    readOnly={shippingSameAsBilling}
                    tabIndex={shippingSameAsBilling ? -1 : 0}
                  />
                  <div className={styles['zip']}>
                    <Input
                      register={register('shippingZipCode', {
                        required: {
                          value: true,
                          message: 'Pole wymagane',
                        },
                      })}
                      label='Kod pocztowy'
                      errors={errors}
                      readOnly={shippingSameAsBilling}
                      tabIndex={shippingSameAsBilling ? -1 : 0}
                    />
                    <Input
                      register={register('shippingCity', {
                        required: {
                          value: true,
                          message: 'Pole wymagane',
                        },
                      })}
                      label='Miasto'
                      errors={errors}
                      readOnly={shippingSameAsBilling}
                      tabIndex={shippingSameAsBilling ? -1 : 0}
                    />
                  </div>
                  <Select<FormValues>
                    control={control}
                    name={'shippingCountry'}
                    rules={{ required: 'Pole wymagane' }}
                    label='Kraj'
                    errors={errors}
                    options={countryList().native().nativeData}
                    tabIndex={shippingSameAsBilling ? -1 : 0}
                  />
                </>
              )}
            </fieldset>
          </>
        )}
        <legend></legend>
        <fieldset>
          <Input
            register={register('client_notes')}
            label='Uwagi do zamówienia (opcjonalnie)'
            errors={errors}
            rows={3}
            textarea={true}
          />
        </fieldset>
      </form>
      <div className={styles.buttons}>
        <button
          className={`link ${styles['return']}`}
          type='button'
          onClick={goToCart}
        >
          Wróć do koszyka
        </button>
        <Button
          form='hook-form'
          type='submit'
          disabled={submitting}
        >
          Przechodzę do płatności
        </Button>
        <div className={styles['payment-inform']}>
          <div>
            <Przelewy24Icon />
            Bezpieczny zakupy z Przelewy24
          </div>
          <p>
            Na kolejnym etapie zostaniesz przekierowana na stronę z płatnościami. Opłata nie zostanie jeszcze pobrana
          </p>
        </div>
      </div>
    </>
  );
}

const Przelewy24Icon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='69'
    height='25'
    fill='none'
  >
    <g clipPath='url(#a)'>
      <path
        fill='#D13239'
        fillRule='evenodd'
        d='m14.69 14.28 5.61-.006-.205 1.27-4.691 4.462 3.938-.008-.23 1.372-5.8.003.244-1.417 4.499-4.29h-3.591l.226-1.385ZM8.552 12.106a1.403 1.403 0 0 0-.49-.307 3.582 3.582 0 0 0-.654-.175 5.537 5.537 0 0 0-.746-.08c-.18-.006-.294-.006-.294-.006H2.089L.453 21.373h1.528l.603-3.642 2.963.014s1.155.046 1.972-.386c.818-.432 1.037-1.414 1.037-1.414s.09-.364.165-.807c.083-.49.165-1.075.208-1.386l.029-.221s.021-.1.021-.258a1.75 1.75 0 0 0-.2-.86 1.41 1.41 0 0 0-.227-.307ZM7.376 13.84c0 .018-.136.808-.316 1.743-.068.357-.344.55-.66.618-.523.11-1.087.09-1.087.09l-2.475-.008.546-3.268 2.242.008s.15-.004.362 0c.24.003.56.014.821.05.226.028.406.075.463.146a.604.604 0 0 1 .115.321c.014.157-.011.29-.011.3ZM27.908 11.538h1.47l-1.646 9.835-1.474-.003 1.65-9.832ZM35.758 14.28l1.41-.003.498 4.993 2.17-5 1.74.004.513 5.014 2.166-5.011h1.464l-3.107 7.09h-1.736l-.502-4.965-2.191 4.964-1.708.008-.717-7.093Z'
        clipRule='evenodd'
      />
      <path
        fill='#D13239'
        d='M25.19 14.338c-.412-.132-1.126-.161-1.732-.154-.585.007-.854.036-1.073.082 0 0-1.04.15-1.632.879-.592.729-.768 2.321-.768 2.321s-.351 1.761-.247 2.35c.104.586.287 1.133.954 1.386.667.257 1.234.243 1.234.243s1.19.093 2.088-.118c.896-.21 1.37-.84 1.37-.84s.212-.27.362-.592c.15-.322.197-.546.205-.575l.093-.382-1.525.003s-.082 1.004-.907 1.097c-.821.093-1.263.057-1.424.05-.158-.007-1.04.032-.969-.704 0-.01 0-.025.004-.046.04-.836.133-1.054.133-1.054l4.788-.014.205-1.179c.236-1.335.068-2.353-1.159-2.753Zm-.32 2.586-3.281-.004.129-.518s.115-.407.34-.579c.23-.171.52-.203.794-.228.272-.025 1-.079 1.592.043.197.039.384.15.434.314.115.386-.007.972-.007.972Z'
      />
      <path
        fill='#D13239'
        d='M21.231 19.352c0 .01-.003.021-.003.032-.004.057.003-.035.003-.032ZM34.23 14.341c-.413-.132-1.127-.16-1.733-.153-.585.007-.854.035-1.073.082 0 0-1.04.15-1.632.879-.592.728-.767 2.32-.767 2.32s-.352 1.762-.248 2.35c.104.587.287 1.133.954 1.387.667.257 1.234.242 1.234.242s1.191.093 2.088-.117c.897-.211 1.37-.84 1.37-.84s.212-.271.362-.593c.15-.321.198-.546.205-.575l.093-.382-1.524.004s-.083 1.003-.908 1.096c-.821.093-1.263.058-1.424.054-.158-.007-1.04.029-.968-.704 0-.01 0-.025.003-.046.04-.836.133-1.054.133-1.054l4.788-.014.205-1.178c.237-1.34.068-2.361-1.159-2.758Zm-.334 2.583-3.282-.004.129-.518s.115-.407.34-.579c.226-.171.52-.203.793-.228.273-.025 1-.079 1.593.043.197.039.384.15.434.314.115.382-.007.972-.007.972Z'
      />
      <path
        fill='#D13239'
        fillRule='evenodd'
        d='m47.41 14.28.944 5.186 2.665-5.189 1.5.014-3.842 7.411s-.696 1.343-1.126 1.682c-.43.34-.696.493-1.048.529-.351.035-.495.06-.832 0l-.358-.064.222-1.326s.595.111.947-.028c.355-.14.638-.74.638-.74l.18-.3-1.389-7.178 1.5.004Z'
        clipRule='evenodd'
      />
      <path
        fill='#B3B2B1'
        fillRule='evenodd'
        d='m53.061 14.984 1.546.004.093-.597s.165-1.078.535-1.285c.118-.068.308-.129.527-.168.405-.072.918-.079 1.338-.065.642.022.886.029 1.539.104.653.075.488.704.488.704l-.13.939s-.057.421-.208.682c-.132.232-.498.39-.71.457-.51.165-2.252.607-2.252.607l-1.37.393s-.843.243-1.313.76a3.123 3.123 0 0 0-.725 1.419c-.064.307-.427 2.432-.427 2.432l7.397.003.247-1.471-5.85.007.104-.6s.068-.618.319-.821c.079-.064.118-.15.585-.314.28-.1 1.234-.354 1.234-.354l2.206-.6s1.205-.307 1.678-.964c.474-.654.657-1.908.657-1.908s.129-1.217.028-1.6c-.096-.382-.459-.839-.9-1.035-.441-.197-.9-.311-2.231-.293-1.33.018-1.99.079-2.665.329-.675.246-1.066.696-1.313 1.332-.27.603-.427 1.903-.427 1.903ZM66.987 17.72l1.036-6.186h-1.836l-5.718 6.114-.258 1.55h5l-.366 2.172 1.535.003.363-2.175 1.417.004.254-1.482h-1.427Zm-1.528.004-3.232-.004 3.935-4.175-.703 4.179ZM11.797 12.348h4.71s1.054-.85 1.804-1.396c.75-.546 2.113-1.407 2.113-1.407l-2.662-1.24s-2.249 1.386-3.203 2.04c-.926.603-2.762 2.003-2.762 2.003ZM21.919 8.67l-2.185-1.464s1.977-1.118 4.606-2.161c2.626-1.043 4.028-1.479 4.028-1.479l.445 2.075s-2.529.843-3.978 1.525c-1.5.636-2.916 1.504-2.916 1.504ZM30.427 5.188l-.38-2.125s2.697-.715 5.165-1.172c2.471-.457 5.746-.675 5.746-.675l-1.083 3.282s-2.88-.392-5.585-.025c-2.105.25-3.863.715-3.863.715ZM41.586 4.777l1.822-3.646s3.992-.079 7.436.453c3.443.529 6.593 1.343 6.524 1.379l-8.73 4.546s-2.041-1.286-4.573-2.075a44.712 44.712 0 0 0-2.48-.657ZM50.203 8.498l1.92 1.45h15.771s-.032-.507-.452-1.228c-.262-.45-.739-.929-1.237-1.425-.183-.179-.908-.743-1.453-1.097-1.392-.9-2.17-1.246-3.616-1.9l-10.933 4.2Z'
        clipRule='evenodd'
      />
      <path
        fill='#D13239'
        d='M12.814 14.274c-.592 0-1.151.232-1.628.492l.082-.492H9.701l-1.256 7.06h1.571l.696-3.91c.144-.793.74-1.775 1.901-1.775l.811-.004.244-1.371h-.854Z'
      />
    </g>
    <defs>
      <clipPath id='a'>
        <path
          fill='#fff'
          d='M0 .534h68.87v24H0z'
        />
      </clipPath>
    </defs>
  </svg>
);
