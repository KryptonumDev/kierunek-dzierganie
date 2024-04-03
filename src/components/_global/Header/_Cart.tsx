'use client';
import { useEffect, useState } from 'react';
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

// TODO: query for available virtual coins
const availableVirtualCoins = 71;

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
}: Cart) {
  const {
    register,
    formState: { errors },
  } = useForm<CartForm>();

  const [virtualValue, setVirtualValue] = useState(null);
  const [isVirtualCoins, setIsVirtualCoins] = useState(false);
  const [isPromoCode, setIsPromoCode] = useState(false);

  useEffect(() => {
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setShowCart();
    });
    return () => removeEventListener('keydown', () => setShowCart());
  }, [setShowCart]);

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
              cart={cart}
              fetchedItems={fetchedItems}
            />
          ) : (
            <EmptyLayout
              image_crochet={image_crochet}
              image_knitting={image_knitting}
            />
          )}
          <form className={cart?.length ? '' : styles['empty']}>
            <div className={styles['line']} />
            {/* {isPromoCode ? (
              <div className={styles.promoCode}>
                <div className={styles.inputWrapper}>
                  <Input
                    label='Wpisz kod rabatowy'
                    type='text'
                    register={register('discount')}
                    errors={errors}
                  />
                  <button onClick={() => setIsPromoCode((prev) => !prev)}>{CrossIcon}</button>
                </div>
                TODO: Add logic for Apply Button
                <button className={`link ${styles.apply}`}>Zastosuj</button>
              </div>
            ) : (
              <Checkbox
                register={register('isDiscount')}
                label='Posiadam kod rabatowy'
                errors={errors}
                onChange={() => setIsPromoCode((prev) => !prev)}
              />
            )} */}
            {/* TODO: Display below `virtualCoins` section only if the user is logged in and has joined affiliation program  */}
            {/* {isVirtualCoins ? (
              <div className={styles.virtualCoins}>
                <div className={styles.inputWrapper}>
                  <Input
                    label='Wpisz ile wirtualnych złotówek chcesz wykorzystać'
                    type='text'
                    maxLength={availableVirtualCoins.toString().length}
                    register={register('virtual', {
                      min: { value: 0, message: 'Wpisz poprawną ilość wirtualnych złotówek' },
                      max: { value: availableVirtualCoins, message: 'Nie masz tyle wirtualnych złotówek' },
                      onChange: (e) => {
                        formatToOnlyDigits(e);
                        setVirtualValue(e.target.value);
                      },
                    })}
                    errors={errors}
                  />
                  <div className={styles.mask}>
                    <span className={styles.hide}>{virtualValue}</span>
                    <span>&nbsp;/{availableVirtualCoins}</span>
                  </div>
                  <button onClick={() => setIsVirtualCoins((prev) => !prev)}>{CrossIcon}</button>
                </div>
              </div>
            ) : (
              <Checkbox
                register={register('isVirtual')}
                label='Chcę wykorzystać wirtualne złotówki'
                errors={errors}
                onChange={() => setIsVirtualCoins((prev) => !prev)}
              />
            )} */}
            <div className={styles['flex']}>
              <button
                onClick={setShowCart}
                type='button'
                className='link'
              >
                Kontynuuj zakupy
              </button>
              <Button
                type='button'
                onClick={goToCheckout}
              >
                Zamawiam
              </Button>
            </div>
          </form>
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

const EmptyLayout = ({ image_crochet, image_knitting }: EmptyCart) => {
  return (
    <div className={styles['empty']}>
      <h2 className='h1'>
        Twój koszyk jest <strong>pusty</strong>
      </h2>
      <p>Zapraszamy do zakupów 😉</p>
      <div className={styles['grid']}>
        <div>
          <Img
            data={image_knitting}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/kursy-dziergania-na-drutach'>Dzierganie</Button>
        </div>
        <div>
          <Img
            data={image_crochet}
            sizes='(max-width: 640px) 150px, 300px'
          />
          <Button href='/kursy-szydelkowania'>Szydełkowanie</Button>
        </div>
      </div>
    </div>
  );
};

const CartGrid = ({ cart, fetchedItems, removeItem, updateItemQuantity }: Grid) => {
  if (!fetchedItems) return;

  return (
    <div className={styles['grid']}>
      {fetchedItems.map((item, i) => (
        <div
          className={styles['product']}
          key={item._id + i}
        >
          <Img
            data={item.gallery}
            sizes='175px'
          />
          <div>
            <h3>{item.name}</h3>
            <div>
              <div className={styles['calculator']}>
                {/* TODO: remove if course */}
                <PickQuantity
                  defaultValue={cart!.find((cartItem) => cartItem.id === item._id)?.quantity}
                  onChange={(e) => updateItemQuantity(item._id, Number(e.target.value))}
                />
              </div>
              {/* TODO: add attributes */}
              <div></div>
            </div>
          </div>
          <div className={styles['right-column']}>
            <div>
              <div className={styles['price']}>
                <span
                  className={item.discount ? styles['discount'] : ''}
                  dangerouslySetInnerHTML={{ __html: formatPrice(item.price) }}
                />
                {item.discount ? <span dangerouslySetInnerHTML={{ __html: formatPrice(item.discount) }} /> : null}
              </div>
              <span className={styles['omnibus']}>
                Najniższa cena z 30 dni przed obniżką:{' '}
                <span dangerouslySetInnerHTML={{ __html: formatPrice(item.discount ?? item.price) }} />
              </span>
            </div>
            <button
              className={`link ${styles['remove']}`}
              onClick={() => removeItem(item._id)}
            >
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
