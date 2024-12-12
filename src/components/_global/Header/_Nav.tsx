'use client';
import Img from '@/components/ui/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.scss';
import type { _NavProps } from './Header.types';
import NavList from './NavList';

const Nav = ({
  links,
  ChevronDownIcon,
  ChevronBackIcon,
  showMenu,
  setShowMenu,
  courses,
  products,
  counts,
}: _NavProps) => {
  const [tab, setTab] = useState<number | null>(null);
  const NavRef = useRef<HTMLElement | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
        setTab(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const isAnchorOrChild = (node: Node): boolean => {
        if (node.nodeName === 'A') return true;
        if (node.parentNode) return isAnchorOrChild(node.parentNode);
        return false;
      };

      if (NavRef.current && !NavRef.current.contains(target)) {
        setTab(null);
      } else if (isAnchorOrChild(target)) {
        setTab(null);
      }
    };

    const handleScroll = () => {
      if (window.innerWidth <= 1189) {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
          setShowMenu(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, setShowMenu, setTab]);

  const navToggle = () => setShowMenu(!showMenu);

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
        ref={NavRef}
      >
        <ul>
          <li
            className={styles['Nav__item']}
            data-id={0}
          >
            <button onClick={() => setTab(tab === 0 ? null : 0)}>
              <span>Kursy</span>
              {ChevronDownIcon}
            </button>{' '}
            {tab === 0 && (
              <NavList
                handleMenu={() => setShowMenu(false)}
                name='Kursy'
                handleClose={() => setTab(null)}
                ChevronBackIcon={ChevronBackIcon}
                ChevronDownIcon={ChevronDownIcon}
                type={'courses'}
                columns={[
                  {
                    name: 'Nauka dziergania na drutach',
                    href: courses.knitting.href,
                    items: courses.knitting.highlighted_courses,
                    showMore:
                      courses.knitting.highlighted_courses.length < counts.courses.knitting
                        ? 'Pokaż więcej kursów dziergania'
                        : null,
                  },
                  {
                    name: 'Nauka szydełkowania',
                    href: courses.crocheting.href,
                    items: courses.crocheting.highlighted_courses,
                    showMore:
                      courses.crocheting.highlighted_courses.length < counts.courses.crocheting
                        ? 'Pokaż więcej kursów szydełkowania'
                        : null,
                  },
                ]}
                additionalLinks={courses.additional_links}
              />
            )}
          </li>
          <li
            className={styles['Nav__item']}
            data-id={1}
          >
            <button onClick={() => setTab(tab === 1 ? null : 1)}>
              <span>Produkty</span>
              {ChevronDownIcon}
            </button>
            {tab === 1 && (
              <NavList
                name='Produkty'
                handleClose={() => setTab(null)}
                handleMenu={() => setShowMenu(false)}
                ChevronBackIcon={ChevronBackIcon}
                ChevronDownIcon={ChevronDownIcon}
                type={'products'}
                columns={[
                  {
                    name: 'Do dziergania',
                    href: products.knitting.href,
                    items: products.knitting.highlighted_products,
                    showMore: 'Pokaż więcej produktów do dziergania',
                  },
                  {
                    name: 'Do szydełkowania',
                    href: products.crocheting.href,
                    items: products.crocheting.highlighted_products,
                    showMore: 'Pokaż więcej produktów do szydełkowania',
                  },
                ]}
                additionalLinks={products.additional_links}
              />
            )}
          </li>
          {links.map(({ name, href, sublinks }, i) => (
            <li
              className={styles['Nav__item']}
              data-id={i + 2}
              key={i + 2}
            >
              {href ? (
                <Link
                  href={href}
                  onClick={() => setShowMenu(false)}
                >
                  {name}
                </Link>
              ) : (
                <button onClick={() => setTab(tab === i + 2 ? null : i + 2)}>
                  <span>{name}</span>
                  {ChevronDownIcon}
                </button>
              )}
              {sublinks && (
                <div className={styles.sublinks}>
                  <ul className='max-width'>
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
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <button
        className={styles['Nav__Toggle']}
        onClick={navToggle}
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
