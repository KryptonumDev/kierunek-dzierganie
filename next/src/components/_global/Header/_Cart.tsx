'use client';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { CrochetingLogo, KnittingLogo } from '@/components/ui/Icons';
import Img from '@/components/ui/image';
import Input from '@/components/ui/Input';
import PickQuantity from '@/components/ui/PickQuantity';
import ProductCard from '@/components/ui/ProductCard';
import { calculateDiscountAmount } from '@/utils/calculate-discount-amount';
import { formatToOnlyDigits } from '@/utils/format-to-only-digits';
import { formatPrice } from '@/utils/price-formatter';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styles from './Header.module.scss';
import type { Cart, CartForm, EmptyCart, Grid } from './Header.types';
import Popup from './Popup/Popup';

const gtag: Gtag.Gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments);
};

export default function Cart({
  goToCheckout,
  setShowCart,
  setPopupState,
  popupState,
  showCart,
  image_crochet,
  image_knitting,
  highlighted_products,
  NavigationCrossIcon,
  PopupCrossIcon,
  VirtualCoinsCrossIcon,
  PromoCodeCrossIcon,
  cart,
  fetchedItems,
  updateItemQuantity,
  removeItem,
  virtualWallet,
  setUsedVirtualMoney,
  usedVirtualMoney,
  usedDiscount,
  setUsedDiscount,
  userId,
  ownedCourses,
  freeShipping,
  shippingMethods,
  currentShippingMethod,
}: Cart) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CartForm>();

  const [isVirtualCoins, setIsVirtualCoins] = useState<boolean>(false);
  const [isPromoCode, setIsPromoCode] = useState(false);
  const [couponVerifying, setCouponVerifying] = useState(false);
  const delivery = useMemo<number | null>(
    () =>
      fetchedItems?.some((item) => item.needDelivery)
        ? Number(shippingMethods.find((method) => method.name === currentShippingMethod)?.price)
        : null,
    [fetchedItems, currentShippingMethod, shippingMethods]
  );
  const totalItemsCount = useMemo(() => {
    return cart?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0;
  }, [cart]);
  const totalItemsPrice = useMemo(() => {
    if (!fetchedItems) return null;
    return fetchedItems?.reduce((acc, item) => acc + (item.discount ?? item.price!) * item.quantity!, 0) ?? 0;
  }, [fetchedItems]);

  const discountCode = watch('discount');

  // Track processed removals to avoid duplicate toasts/removals across quick re-renders/StrictMode
  const processedRemovalsRef = useRef<Set<string>>(new Set());

  // Clear processed set when cart is cleared to allow future toasts if user re-adds
  useEffect(() => {
    if (!cart || cart.length === 0) {
      processedRemovalsRef.current.clear();
    }
  }, [cart]);

  useEffect(() => {
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setShowCart();
    });
    return () => removeEventListener('keydown', () => setShowCart());
  }, [setShowCart]);

  useEffect(() => {
    if (usedDiscount?.type === 'FIXED PRODUCT') {
      const eligibleIds =
        Array.isArray((usedDiscount as any).discounted_products) && (usedDiscount as any).discounted_products.length > 0
          ? (usedDiscount as any).discounted_products.map((p: { id: string }) => p.id)
          : usedDiscount.discounted_product?.id
            ? [usedDiscount.discounted_product.id]
            : [];

      const product = eligibleIds.length === 0 ? cart?.[0] : cart?.find((item) => eligibleIds.includes(item.product));
      if (!product) {
        setUsedDiscount(null);
        toast('Produkt, do którego przypisany jest kupon, został usunięty z koszyka');
      }
    }
  }, [cart, usedDiscount, setUsedDiscount]);

  // Unified cart validation: remove invalid items (related dependency missing, owned courses, conflicting bundles)
  useEffect(() => {
    if (!fetchedItems) return;

    const plannedRemovals: Array<{ id: string; message: string }> = [];

    fetchedItems.forEach((el) => {
      const cartId = el.variant ? el._id + `variant:${el.variant._id}` : el._id;

      // 1) Products that require owning/having related course (any product with a related course)
      if (el.related?._id && el._type === 'product') {
        const relatedInCart = fetchedItems.some((item) => item._id === el.related!._id);
        const relatedOwned = ownedCourses?.includes(el.related._id) ?? false;
        if (!relatedInCart && !relatedOwned) {
          if (!processedRemovalsRef.current.has(cartId)) {
            plannedRemovals.push({
              id: cartId,
              message: `${el.name} został usunięty z koszyka, ponieważ nie posiadasz ${el.related.name}`,
            });
          }
        }
      }

      // 2) Already-owned individual courses
      if (el._type === 'course') {
        if (ownedCourses?.includes(el._id)) {
          if (!processedRemovalsRef.current.has(cartId)) {
            plannedRemovals.push({
              id: cartId,
              message: `${el.name} został usunięty z koszyka, ponieważ już posiadasz ten kurs.`,
            });
          }
        }
      }

      // 3) Bundles containing any already-owned course
      if (el._type === 'bundle') {
        const bundleCourseIds = el.courses?.map((c) => c._id) ?? [];
        const hasConflict = bundleCourseIds.some((id) => ownedCourses?.includes(id));
        if (hasConflict) {
          if (!processedRemovalsRef.current.has(cartId)) {
            plannedRemovals.push({
              id: cartId,
              message: `Pakiet "${el.name}" został usunięty z koszyka, ponieważ posiadasz już kurs z tego pakietu.`,
            });
          }
        }
      }
    });

    // Execute removals with deduped toasts
    plannedRemovals.forEach(({ id, message }) => {
      processedRemovalsRef.current.add(id);
      removeItem(id);
      toast(message, { toastId: `rm-${id}` });
    });
  }, [fetchedItems, ownedCourses, removeItem]);

  const cartItems = cart?.map((item) => {
    return { ...item, _type: fetchedItems?.find((fetchedItem) => fetchedItem._id === item.id)?._type };
  });

  const onSubmit = async () => {
    const isVerfied = await fetch('/api/coupon/verify', {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({ code: discountCode, userId, cart: cartItems, isSubmit: true }),
    });

    if (isVerfied.ok || !discountCode) {
      goToCheckout();
    } else {
      const data = await isVerfied.json();
      toast(data.error);
    }
  };

  const verifyCoupon = async () => {
    setCouponVerifying(true);

    await fetch('/api/coupon/verify', {
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({ code: discountCode, userId, cart: cartItems }),
    })
      .then((res) => res.json())

      .then((data) => {
        if (data.error) {
          toast(data.error);
          return;
        }

        const eligibleIds =
          Array.isArray(data.discounted_products) && data.discounted_products.length > 0
            ? data.discounted_products.map((p: { id: string }) => p.id)
            : data.discounted_product?.id
              ? [data.discounted_product.id]
              : [];

        const eligibleCount = eligibleIds.length > 0 ? cart?.filter((i) => eligibleIds.includes(i.product)).length : 0;

        setUsedDiscount({
          totalVoucherAmount: data.coupons_types.coupon_type === 'VOUCHER' ? data.amount : null,
          amount: data.coupons_types.coupon_type === 'VOUCHER' ? data.voucher_amount_left : data.amount,
          code: discountCode,
          id: data.id,
          type: data.coupons_types.coupon_type,
          discounted_product: data.discounted_product,
          discounted_products: data.discounted_products,
          affiliatedBy: data.affiliation_of,
          eligibleCount: data.coupons_types.coupon_type === 'FIXED PRODUCT' ? eligibleCount : undefined,
        });
      })
      .catch((error) => {
        toast(error.message);
      })
      .finally(() => setCouponVerifying(false));
  };

  const filteredFetchItems = useMemo(() => {
    if (!fetchedItems) return;
    const items = [...fetchedItems];

    const materials_linkIds = items?.map((item) => item.materials_link?._id);
    const printed_manualIds = items?.map((item) => item.printed_manual?._id);

    items?.map((product) => {
      if (materials_linkIds?.includes(product._id)) {
        items?.forEach((item) => {
          if (item.materials_link?._id === product._id) {
            item.materials_link = undefined;
          }
        });
      }
      if (printed_manualIds?.includes(product._id)) {
        items?.forEach((item) => {
          if (item.printed_manual?._id === product._id) {
            item.printed_manual = undefined;
          }
        });
      }
    });

    return items;
  }, [fetchedItems]);

  useEffect(() => {
    if (
      cart?.length === 0 ||
      filteredFetchItems?.length == 0 ||
      (fetchedItems && filteredFetchItems?.length == undefined)
    ) {
      setPopupState(false);
    }
  }, [filteredFetchItems, setPopupState, fetchedItems, cart]);

  return (
    <>
      <div
        className={styles.CartWrapper}
        data-visible={!!showCart}
      >
        <div
          className={styles['Cart']}
          data-blurred={popupState}
        >
          <div className={`${styles['flex']} ${styles['CartHeader']}`}>
            <h3>Twoje produkty</h3>
            <button
              onClick={setShowCart}
              className={styles.CloseButton}
            >
              {NavigationCrossIcon}
            </button>
          </div>
          {freeShipping > 0 && cart?.length && fetchedItems?.some((item) => item._type === 'product') && (
            <div className={styles['freeDelivery']}>
              <span
                className={styles['line']}
                style={
                  {
                    '--filled': totalItemsPrice! > freeShipping ? '100%' : (totalItemsPrice! / freeShipping) * 100,
                  } as React.CSSProperties
                }
              />
              <p>
                Darmowa dostawa od <strong>{formatPrice(freeShipping)}</strong>
              </p>
            </div>
          )}
          <div>
            {cart?.length ? (
              <CartGrid
                updateItemQuantity={updateItemQuantity}
                removeItem={removeItem}
                fetchedItems={fetchedItems}
              />
            ) : (
              <EmptyLayout
                image_crochet={image_crochet}
                image_knitting={image_knitting}
                setShowCart={setShowCart}
              />
            )}
            {(filteredFetchItems?.length ?? 0) > 0 &&
              filteredFetchItems?.some((item) => item.materials_link || item.printed_manual) && (
                <div className={styles.linkWrapper}>
                  <p>Psst. Szukasz materiałów do kupowanych kursów? Sprawdź, co może Ci się przydać!</p>
                  <button
                    className={`link ${styles.link}`}
                    onClick={() => setPopupState(!popupState)}
                  >
                    Pokaż materiały
                  </button>
                </div>
              )}
            {cart?.length != 0 && (
              <>
                {fetchedItems && typeof totalItemsPrice === 'number' ? (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={cart?.length ? '' : styles['empty']}
                  >
                    <div className={styles['line']} />
                    <div className={styles['additional-info']}>
                      <div className={styles['left-side']}>
                        {isPromoCode ? (
                          <div className={styles.promoCode}>
                            <div className={styles.inputWrapper}>
                              <Input
                                label='Wpisz kod rabatowy'
                                type='text'
                                register={register('discount')}
                                errors={errors}
                              />
                              <button
                                onClick={() => {
                                  setIsPromoCode((prev) => !prev);
                                  setUsedDiscount(null);
                                  setValue('discount', '');
                                }}
                              >
                                {PromoCodeCrossIcon}
                              </button>
                            </div>
                            <button
                              disabled={couponVerifying}
                              type='button'
                              onClick={verifyCoupon}
                              className={`link ${styles.apply}`}
                            >
                              Zastosuj
                            </button>
                          </div>
                        ) : (
                          <Checkbox
                            register={register('isDiscount')}
                            label={<>Posiadam kod rabatowy</>}
                            errors={errors}
                            onChange={() => setIsPromoCode((prev) => !prev)}
                          />
                        )}
                        {virtualWallet ? (
                          <>
                            {isVirtualCoins ? (
                              <div className={styles.virtualCoins}>
                                <div className={styles.inputWrapper}>
                                  <Input
                                    label='Wpisz ile wirtualnych złotówek chcesz wykorzystać'
                                    type='text'
                                    max={virtualWallet}
                                    min={11}
                                    maxLength={virtualWallet.toString().length}
                                    register={register('virtual', {
                                      min: { value: 1, message: 'Wpisz poprawną ilość wirtualnych złotówek' },
                                      max: { value: virtualWallet, message: 'Nie masz tyle wirtualnych złotówek' },
                                      onChange: (e) => {
                                        formatToOnlyDigits(e);
                                        setUsedVirtualMoney(e.target.value);
                                      },
                                    })}
                                    errors={errors}
                                  />
                                  <div className={styles.mask}>
                                    <span className={styles.hide}>{usedVirtualMoney}</span>
                                    <span>&nbsp;/&nbsp;{virtualWallet}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setIsVirtualCoins((prev) => !prev);
                                      setUsedVirtualMoney(null);
                                      setValue('virtual', '');
                                    }}
                                  >
                                    {VirtualCoinsCrossIcon}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <Checkbox
                                register={register('isVirtual')}
                                label={<>Chcę wykorzystać wirtualne złotówki</>}
                                errors={errors}
                                onChange={() => setIsVirtualCoins((prev) => !prev)}
                              />
                            )}
                          </>
                        ) : null}
                      </div>
                      <div className={styles['right-side']}>
                        <p>
                          <span>
                            {totalItemsCount}{' '}
                            {totalItemsCount === 1 ? 'produkt' : totalItemsCount < 5 ? 'produkty' : 'produktów'}
                          </span>
                          <span>{formatPrice(totalItemsPrice)}</span>
                        </p>
                        {delivery !== null && (
                          <p>
                            <span>Dostawa</span>
                            <span>{formatPrice(delivery)}</span>
                          </p>
                        )}
                        {usedDiscount && (
                          <p>
                            <span>Kupon: {usedDiscount.code}</span>
                            <span>{formatPrice(calculateDiscountAmount(totalItemsPrice, usedDiscount, delivery))}</span>
                          </p>
                        )}
                        {usedVirtualMoney && usedVirtualMoney > 0 && (
                          <p>
                            <span>Wykorzystane WZ</span>
                            <span>-{formatPrice(usedVirtualMoney * 100)}</span>
                          </p>
                        )}
                        <p>
                          <span>Razem</span>
                          <span>
                            {formatPrice(
                              totalItemsPrice +
                                (delivery ? delivery : 0) +
                                (usedDiscount ? calculateDiscountAmount(totalItemsPrice, usedDiscount, delivery) : 0) -
                                (usedVirtualMoney ? usedVirtualMoney * 100 : 0),
                              0
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className={styles['flex']}>
                      <button
                        onClick={setShowCart}
                        type='button'
                        className='link'
                      >
                        Kontynuuj zakupy
                      </button>
                      <Button type='submit'>Zamawiam</Button>
                    </div>
                  </form>
                ) : (
                  <div className={styles['empty']}>
                    <h2 className='h1'>
                      Ładowanie <strong>koszyka</strong>
                    </h2>
                    <p>Proszę czekać...</p>
                  </div>
                )}
              </>
            )}
          </div>
          {highlighted_products && (
            <div className={styles['highlighted']}>
              <h3>
                Te produkty mogą Ci się <strong>spodobać</strong>
              </h3>
              <p>
                Sprawdź, <strong>co dla Ciebie przygotowaliśmy</strong>
              </p>
              <div className={styles['grid']}>
                {highlighted_products.map((product, i) => (
                  <ProductCard
                    key={product._id + i}
                    data={product}
                    inCart={cart?.some((item) => item.id === product._id)}
                    onClick={() => setShowCart()}
                    owned={ownedCourses?.includes(product._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {popupState && (filteredFetchItems?.length ?? 0) > 0 && (
          <Popup
            data={filteredFetchItems!}
            closeIcon={PopupCrossIcon}
            setPopupState={setPopupState}
            popupState={popupState}
            className={styles.popup}
            setShowCart={setShowCart}
          />
        )}
      </div>
    </>
  );
}

const EmptyLayout = ({ image_crochet, image_knitting, setShowCart }: EmptyCart) => {
  return (
    <div className={styles['empty']}>
      <h2 className='h1'>
        Twój koszyk jest <strong>pusty</strong>
      </h2>
      <p>Zapraszamy do zakupów 😉</p>
      <div className={styles['grid']}>
        <div>
          <Link
            href='/kursy-dziergania-na-drutach'
            onClick={() => setShowCart(false)}
            tabIndex={-1}
            className={styles.img}
            aria-label='Kursy dziergania na drutach'
          >
            <div className={styles.iconWrapper}>
              <KnittingLogo />
            </div>
            <Img
              data={image_knitting}
              sizes='(max-width: 640px) 150px, 300px'
              className={styles.image}
            />
          </Link>
          <Button
            href='/kursy-dziergania-na-drutach'
            className={styles.cta}
          >
            Kursy dziergania
          </Button>
        </div>
        <div>
          <Link
            href='/kursy-szydelkowania'
            onClick={() => setShowCart(false)}
            tabIndex={-1}
            className={styles.img}
            aria-label='Kursy szydełkowania'
          >
            <div
              className={styles.iconWrapper}
              data-crocheting='true'
            >
              <CrochetingLogo />
            </div>
            <Img
              data={image_crochet}
              sizes='(max-width: 640px) 150px, 300px'
              className={styles.image}
            />
          </Link>
          <Button
            href='/kursy-szydelkowania'
            className={styles.cta}
          >
            Kursy szydełkowania
          </Button>
        </div>
      </div>
    </div>
  );
};

const CartGrid = ({ fetchedItems, removeItem, updateItemQuantity }: Grid) => {
  if (!fetchedItems) return;

  return (
    <div className={styles['grid']}>
      {fetchedItems.map((item, i) => (
        <div
          className={styles['product']}
          key={item._id + i}
        >
          {(item.gallery || item.variant?.gallery) && (
            <Img
              data={item.gallery ?? item.variant!.gallery}
              sizes='175px'
            />
          )}
          <div>
            <div>
              <h3>
                {item.name} {item.variant ? `- ${item.variant.name}` : ''}
              </h3>
              {item._type === 'voucher' && (
                <div className={styles['voucher-data']}>
                  <p>
                    {item.voucherData!.dedication ? (
                      <>
                        Od: {item.voucherData?.dedication.from},<br />
                        Do: {item.voucherData?.dedication.to},<br />
                        Wiadomość: {item.voucherData?.dedication.message}
                      </>
                    ) : (
                      <>Bez dedykacji</>
                    )}
                  </p>
                </div>
              )}
            </div>
            {item._type === 'product' && (
              <div>
                <div className={styles['calculator']}>
                  <PickQuantity
                    min={1}
                    max={item.countInStock ?? item.variant!.countInStock}
                    defaultValue={item.quantity!}
                    change={(count) => {
                      const productId = item.variant ? item._id + 'variant:' + item.variant._id : item._id;
                      updateItemQuantity(productId, count);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={styles['right-column']}>
            <div>
              <div className={styles['price']}>
                <span
                  className={item.discount ? styles['discount'] : ''}
                  dangerouslySetInnerHTML={{ __html: formatPrice(item.price!) }}
                />
                {item.discount ? <span dangerouslySetInnerHTML={{ __html: formatPrice(item.discount) }} /> : null}
              </div>
              {item._type !== 'voucher' ? (
                <span className={styles['omnibus']}>
                  Najniższa cena z 30 dni przed obniżką:{' '}
                  <span dangerouslySetInnerHTML={{ __html: formatPrice(item.price!) }} />
                </span>
              ) : (
                <p>
                  {item.voucherData?.type === 'PHYSICAL' ? (
                    <>
                      Wersja <strong>fizyczna</strong>
                    </>
                  ) : (
                    <>
                      Wersja <strong>elektroniczna</strong>
                    </>
                  )}
                </p>
              )}
            </div>
            <button
              className={`link ${styles['remove']}`}
              onClick={() => {
                removeItem(item.variant ? item._id + 'variant:' + item.variant._id : item._id);
                gtag('event', 'remove_from_cart', {
                  currency: 'PLN',
                  value: item.discount
                    ? (item.discount / 100) * (item.quantity ?? 1)
                    : (item.price! / 100) * (item.quantity ?? 1),
                  items: [
                    {
                      id: item._id,
                      name: item.name,
                      discount: item.discount ? (item.price! - item.discount) / 100 : undefined,
                      price: item.price! / 100,
                      item_variant: item.variant?._id,
                      item_category: item._type,
                      item_category2: item.basis,
                      quantity: item.quantity ?? 1,
                    },
                  ],
                });
              }}
            >
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
