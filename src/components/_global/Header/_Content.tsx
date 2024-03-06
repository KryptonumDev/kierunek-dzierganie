'use client';
import Link from 'next/link';
import styles from './Header.module.scss';
import Search from './_Search';
import Annotation from './_Annotation';
import Nav from './_Nav';
import type { QueryProps } from './Header.types';
import { useState } from 'react';
import Cart from './_Cart';

const Content = ({
  markdownNavAnnotation,
  global: { nav_Annotation, nav_Links },
  cart: { image_crochet, image_knitting, highlighted_products },
  Logo,
  ChevronDownIcon,
  ChevronBackIcon,
  SearchIcon,
  CloseIcon,
}: QueryProps) => {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Cart
        setShowCart={() => setShowCart(false)}
        showCart={showCart}
        image_knitting={image_knitting}
        image_crochet={image_crochet}
        highlighted_products={highlighted_products}
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
          />
          <ul className={styles.quickLinks}>
            <li>
              <Link href='/kontakt'>Kontakt</Link>
            </li>
            <li>
              <Link href='/profil'>Mój profil</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowCart(true);
                }}
                className={styles.basket}
                data-basket-items='2'
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
    </>
  );
};

export default Content;
