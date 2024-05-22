'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';
import Img from '@/components/ui/image';
import type { _NavProps } from './Header.types';

const Nav = ({ links, ChevronDownIcon, ChevronBackIcon, showMenu, setShowMenu }: _NavProps) => {
  const [tab, setTab] = useState<number | null>(null);

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowMenu(false);
      setTab(null);
    }
  };
  const handleClick = () => setTab(null);
  const navToggle = () => setShowMenu(!showMenu);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleClick);
    };
  });

  const BackBtn = ({ children }: { children: React.ReactNode }) => (
    <button
      className={styles['back-btn']}
      onClick={() => setTab(null)}
    >
      {ChevronBackIcon}
      <span>{children}</span>
    </button>
  );

  return (
    <>
      <nav
        className={styles['Nav']}
        data-opened={showMenu}
        data-tab={tab}
      >
        <ul>
          {links.map(({ name, href, sublinks }, i) => (
            <li
              className={styles['Nav__item']}
              data-id={i}
              key={i}
            >
              {href ? (
                <Link
                  href={href}
                  onClick={() => setShowMenu(false)}
                >{name}</Link>
              ) : (
                <button onClick={() => setTab(tab === i ? null : i)}>
                  <span>{name}</span>
                  {ChevronDownIcon}
                </button>
              )}
              {sublinks && (
                <ul>
                  <BackBtn>{name}</BackBtn>
                  {sublinks.map(({ img, name, href }, i) => (
                    <li key={i}>
                      <Link
                        href={href}
                        onClick={() => setShowMenu(false)}
                      >
                        {img && (
                          <Img
                            data={img}
                            sizes='48px'
                          />
                        )}
                        <span>{name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button
        className={styles['Nav__Toggle']}
        onClick={() => navToggle()}
        aria-label={showMenu ? 'Zamknij menu' : 'Otwórz menu'}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  );
};

export default Nav;
