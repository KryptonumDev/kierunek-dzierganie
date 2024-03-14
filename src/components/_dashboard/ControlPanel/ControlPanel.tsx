'use client';

import Link from 'next/link';
import styles from './ControlPanel.module.scss';
import { usePathname } from 'next/navigation';

const links = [
  {
    name: 'Moje kursy',
    href: '/moje-konto/kursy',
  },
  {
    name: 'Historia zakupów',
    href: '/moje-konto/historia-zakupow',
  },
  {
    name: 'Pliki do pobrania',
    href: '/moje-konto/pliki-do-pobrania',
  },
  {
    name: 'Moje dane',
    href: '/moje-konto/dane',
  },
  {
    name: 'Program lojalnościowy',
    href: '/moje-konto/program-lojalnosciowy',
  },
  {
    name: 'Pomoc',
    href: '/moje-konto/pomoc',
  },
];

const ControlPanel = () => {
  const pathname = usePathname();
  return (
    <section className={styles['ControlPanel']}>
      <ul>
        {links.map((link, index) => (
          <li
            className={pathname.includes(link.href) ? styles['active'] : ''}
            key={index}
          >
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
      <button className='link'>Wyloguj się</button>
    </section>
  );
};

export default ControlPanel;
