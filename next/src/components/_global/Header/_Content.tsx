'use client';
import type { Discount } from '@/global/types';
import { useCartItems } from '@/utils/useCartItems';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './Header.module.scss';
import type { QueryProps } from './Header.types';
import Search from './Search/Search';
import Annotation from './_Annotation';
import Nav from './_Nav';

const Cart = dynamic(() => import('./_Cart'), { ssr: false });
const Checkout = dynamic(() => import('./Checkout'), { ssr: false });

const Content = ({
  markdownNavAnnotation,
  global: { image_crochet, image_knitting, nav_Annotation, nav_Links, nav_courses, nav_products },
  Logo,
  ChevronDownIcon,
  ChevronBackIcon,
  SearchIcon,
  CloseIcon,
  NavigationCrossIcon,
  PopupCrossIcon,
  VirtualCoinsCrossIcon,
  PromoCodeCrossIcon,
  cart: { highlighted },
  userEmail,
  shipping,
  billing,
  virtualWallet,
  userId,
  ownedCourses,
  counts,
  deliverySettings,
  freeShipping,
  ShoppingBagIcon,
  ChatIcon,
  UserIcon,
}: QueryProps) => {
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [popupState, setPopupState] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [usedDiscount, setUsedDiscount] = useState<Discount | null>(null);
  const [usedVirtualMoney, setUsedVirtualMoney] = useState<number | null>(null);
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);
  const { cart, fetchedItems, updateItemQuantity, removeItem, totalUniqueItems } = useCartItems();

  const shippingMethods = useMemo(() => {
    return [
      {
        name: 'Kurier InPost',
        price: deliverySettings?.deliveryPrice ?? 2000,
        map: false,
      },
      {
        name: 'Paczkomat Inpost',
        price: deliverySettings?.paczkomatPrice ?? 2000,
        map: true,
      },
    ];
  }, [deliverySettings]);

  const [currentShippingMethod, setCurrentShippingMethod] = useState<string>(shippingMethods[0]!.name);

  useEffect(() => {
    setTotalItemsCount(totalUniqueItems);
  }, [totalUniqueItems]);

  const [logoReversed, setLogoReversed] = useState(false);
  useEffect(() => {
    const toggleLogoReversed = () => setLogoReversed((prev) => !prev);
    const intervalId = setInterval(toggleLogoReversed, 13000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Checkout
        NavigationCrossIcon={NavigationCrossIcon}
        setShowCheckout={() => setShowCheckout(false)}
        showCheckout={showCheckout}
        fetchedItems={fetchedItems}
        goToCart={() => {
          setShowCart(true);
          setShowCheckout(false);
          setPopupState(true);
        }}
        setUsedDiscount={setUsedDiscount}
        usedDiscount={usedDiscount}
        userEmail={userEmail}
        shipping={shipping}
        billing={billing}
        virtualWallet={virtualWallet}
        usedVirtualMoney={usedVirtualMoney}
        userId={userId}
        deliverySettings={deliverySettings}
        freeShipping={freeShipping}
        shippingMethods={shippingMethods}
        currentShippingMethod={currentShippingMethod}
        setCurrentShippingMethod={setCurrentShippingMethod}
      />
      <Cart
        goToCheckout={() => {
          setShowCheckout(true);
          setShowCart(false);
          setPopupState(false);
        }}
        setShowCart={() => setShowCart(false)}
        setPopupState={setPopupState}
        popupState={popupState}
        showCart={showCart}
        image_knitting={image_knitting}
        image_crochet={image_crochet}
        NavigationCrossIcon={NavigationCrossIcon}
        PopupCrossIcon={PopupCrossIcon}
        VirtualCoinsCrossIcon={VirtualCoinsCrossIcon}
        PromoCodeCrossIcon={PromoCodeCrossIcon}
        cart={cart}
        fetchedItems={fetchedItems}
        updateItemQuantity={updateItemQuantity}
        removeItem={removeItem}
        highlighted_products={highlighted}
        virtualWallet={virtualWallet}
        setUsedVirtualMoney={setUsedVirtualMoney}
        usedVirtualMoney={usedVirtualMoney}
        usedDiscount={usedDiscount}
        setUsedDiscount={setUsedDiscount}
        userId={userId}
        ownedCourses={ownedCourses}
        deliverySettings={deliverySettings}
        freeShipping={freeShipping}
        shippingMethods={shippingMethods}
        currentShippingMethod={currentShippingMethod}
      />
      <a
        href='#main'
        className={styles.skipToMainContent}
      >
        Przejdź do głównej treści
      </a>
      {nav_Annotation && (
        <Annotation
          CloseIcon={CloseIcon}
          rawContent={nav_Annotation}
        >
          {markdownNavAnnotation}
        </Annotation>
      )}
      <header className={styles['Header']}>
        <div className={`max-width ${styles['max-width']}`}>
          <Link
            href='/'
            aria-label='Strona główna'
            className={styles.logo}
            data-reversed={logoReversed}
            onClick={() => setShowMenu(false)}
          >
            {Logo[0]}
            {Logo[1]}
          </Link>
          <Nav
            links={nav_Links}
            courses={nav_courses}
            counts={counts}
            products={nav_products}
            ChevronDownIcon={ChevronDownIcon}
            ChevronBackIcon={ChevronBackIcon}
            SearchIcon={SearchIcon}
            CloseIcon={CloseIcon}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
          <ul className={styles.quickLinks}>
            <li>
              <Link href='/kontakt'>
                {ChatIcon}
                <span>Kontakt</span>
              </Link>
            </li>
            <li>
              <Link href='/moje-konto/kursy'>
                {UserIcon}
                <span>Moje Konto</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowCart(true);
                  setPopupState(popupState);
                }}
                className={styles.basket}
                aria-label='Otwórz koszyk'
              >
                {ShoppingBagIcon}
                <span className={`${styles['total-items']} ${totalItemsCount > 0 ? styles['active'] : ''}`}>
                  {totalItemsCount}
                </span>
              </button>
            </li>
          </ul>
        </div>
        <Search
          SearchIcon={SearchIcon}
          CloseIcon={CloseIcon}
        />
      </header>
      <div
        onClick={() => {
          setShowCart(false);
          setShowCheckout(false);
          setShowMenu(false);
          setPopupState(false);
        }}
        className={styles['Overlay']}
        data-visible={!!(showCart || showCheckout || showMenu)}
        style={{ zIndex: showMenu ? 8 : undefined }}
      />
    </>
  );
};

export default Content;
