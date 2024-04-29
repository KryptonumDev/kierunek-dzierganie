'use client';
import { useEffect, useMemo, useState } from 'react';
import styles from './Header.module.scss';
import { useForm } from 'react-hook-form';
import Img from '@/components/ui/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProductCard from '@/components/ui/ProductCard';
import Checkbox from '@/components/ui/Checkbox';
import { formatPrice } from '@/utils/price-formatter';
import { formatToOnlyDigits } from '@/utils/format-to-only-digits';
import type { EmptyCart, Grid, Cart, CartForm } from './Header.types';
import PickQuantity from '@/components/ui/PickQuantity';
import { toast } from 'react-toastify';
import { calculateDiscountAmount } from '@/utils/calculate-discount-amount';
import Link from 'next/link';

export default function Cart({
  goToCheckout,
  setShowCart,
  showCart,
  image_crochet,
  image_knitting,
  highlighted_products,
  CrossIcon,
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
  const totalItemsCount = useMemo(() => {
    return cart?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0;
  }, [cart]);
  const totalItemsPrice = useMemo(() => {
    if (!fetchedItems) return null;
    return fetchedItems?.reduce((acc, item) => acc + (item.discount ?? item.price!) * item.quantity!, 0) ?? 0;
  }, [fetchedItems]);

  const discountCode = watch('discount');

  useEffect(() => {
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setShowCart();
    });
    return () => removeEventListener('keydown', () => setShowCart());
  }, [setShowCart]);

  const onSubmit = () => {
    goToCheckout();
  };

  const verifyCoupon = async () => {
    await fetch('/api/coupon/verify', {
      method: 'POST',
      body: JSON.stringify({ code: discountCode, userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast(data.error);
          return;
        }

        setUsedDiscount({
          amount: data.amount,
          code: discountCode,
          id: data.id,
          type: data.coupons_types.coupon_type,
          affiliatedBy: data.affiliation_of,
        });
      })
      .catch((error) => {
        toast(error.message);
      });
  };
  return (
    <>
      <div
        className={styles['Cart']}
        data-visible={!!showCart}
      >
        <div className={`${styles['flex']} ${styles['CartHeader']}`}>
          <h3>Twoje produkty</h3>
          <button
            onClick={setShowCart}
            className={styles.CloseButton}
          >
            {CrossIcon}
          </button>
        </div>
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
          {cart?.length != 0 && (
            <>
              {fetchedItems && totalItemsPrice ? (
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
                              {CrossIcon}
                            </button>
                          </div>
                          {/* TODO: Add logic for Apply Button */}
                          <button
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
                          label='Posiadam kod rabatowy'
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
                                  <span>&nbsp;/{virtualWallet}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setIsVirtualCoins((prev) => !prev);
                                    setUsedVirtualMoney(null);
                                    setValue('virtual', '');
                                  }}
                                >
                                  {CrossIcon}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <Checkbox
                              register={register('isVirtual')}
                              label='Chcę wykorzystać wirtualne złotówki'
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
                      {usedDiscount && (
                        <p>
                          <span>Kupon: {usedDiscount.code}</span>
                          <span>{formatPrice(calculateDiscountAmount(totalItemsPrice, usedDiscount))}</span>
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
                              (usedDiscount ? calculateDiscountAmount(totalItemsPrice, usedDiscount) : 0) -
                              (usedVirtualMoney ? usedVirtualMoney * 100 : 0)
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
                  data={product}
                  key={i}
                  inCart={cart?.some((item) => item.id === product._id)}
                />
              ))}
            </div>
          </div>
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
        <Link
          href='/kursy-dziergania-na-drutach'
          onClick={() => setShowCart(false)}
        >
          <Img
            data={image_knitting}
            sizes='(max-width: 640px) 150px, 300px'
          />
        </Link>
        <Link
          href='/kursy-szydelkowania'
          onClick={() => setShowCart(false)}
        >
          <Img
            data={image_crochet}
            sizes='(max-width: 640px) 150px, 300px'
          />
        </Link>
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
            <h3>
              {item.name} {item.variant ? `- ${item.variant.name}` : ''}
            </h3>
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
              <span className={styles['omnibus']}>
                Najniższa cena z 30 dni przed obniżką:{' '}
                <span dangerouslySetInnerHTML={{ __html: formatPrice(item.discount ?? item.price!) }} />
              </span>
            </div>
            <button
              className={`link ${styles['remove']}`}
              onClick={() => removeItem(item.variant ? item._id + 'variant:' + item.variant._id : item._id)}
            >
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
