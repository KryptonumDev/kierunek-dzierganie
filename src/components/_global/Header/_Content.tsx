'use client';
import type { Discount } from '@/global/types';
import { useCartItems } from '@/utils/useCartItems';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.scss';
import type { QueryProps } from './Header.types';
import Search from './Search/Search';
import Annotation from './_Annotation';
import Nav from './_Nav';

const Cart = dynamic(() => import('./_Cart'), { ssr: false });
const Checkout = dynamic(() => import('./Checkout'), { ssr: false });

const Content = ({
  markdownNavAnnotation,
  global: { image_crochet, image_knitting, nav_Annotation, nav_Links },
  Logo,
  ChevronDownIcon,
  ChevronBackIcon,
  SearchIcon,
  CloseIcon,
  CrossIcon,
  cart: { highlighted_products },
  userEmail,
  shipping,
  billing,
  virtualWallet,
}: QueryProps) => {
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [usedDiscount, setUsedDiscount] = useState<Discount | null>(null);
  const [usedVirtualMoney, setUsedVirtualMoney] = useState<number | null>(null);
  const { cart, fetchedItems, updateItemQuantity, removeItem } = useCartItems();

  return (
    <>
      <Checkout
        CrossIcon={CrossIcon}
        setShowCheckout={() => setShowCheckout(false)}
        showCheckout={showCheckout}
        fetchedItems={fetchedItems}
        goToCart={() => {
          setShowCart(true);
          setShowCheckout(false);
        }}
        userEmail={userEmail}
        shipping={shipping}
        billing={billing}
        virtualWallet={virtualWallet}
      />
      <Cart
        goToCheckout={() => {
          setShowCheckout(true);
          setShowCart(false);
        }}
        setShowCart={() => setShowCart(false)}
        showCart={showCart}
        image_knitting={image_knitting}
        image_crochet={image_crochet}
        CrossIcon={CrossIcon}
        cart={cart}
        fetchedItems={fetchedItems}
        updateItemQuantity={updateItemQuantity}
        removeItem={removeItem}
        highlighted_products={highlighted_products}
        virtualWallet={virtualWallet}
        setUsedVirtualMoney={setUsedVirtualMoney}
        usedVirtualMoney={usedVirtualMoney}
        usedDiscount={usedDiscount}
        setUsedDiscount={setUsedDiscount}
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
          >
            {Logo}
          </Link>
          <Nav
            links={nav_Links}
            ChevronDownIcon={ChevronDownIcon}
            ChevronBackIcon={ChevronBackIcon}
            SearchIcon={SearchIcon}
            CloseIcon={CloseIcon}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
          <ul className={styles.quickLinks}>
            <li>
              <Link href='/kontakt'>Kontakt</Link>
            </li>
            <li>
              <Link href='/moje-konto/kursy'>Mój profil</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowCart(true);
                }}
                className={styles.basket}
                // data-basket-items='2'
              >
                Koszyk
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
        }}
        className={styles['Overlay']}
        data-visible={!!(showCart || showCheckout || showMenu)}
        style={{ zIndex: showMenu ? 8 : undefined }}
      />
    </>
  );
};

export default Content;
