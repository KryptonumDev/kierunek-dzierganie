import styles from './styles.module.scss';
import { Facebook, Instagram, Logo, Youtube } from '@/components/atoms/Icons';
import Link from 'next/link';

const socials = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/zrobmimamo',
    icon: <Facebook />
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/zrobmimamo',
    icon: <Instagram />
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@zrobmimamo2473',
    icon: <Youtube />
  },
]

const Nav = () => {
  return (
    <nav className={styles.wrapper}>
      <div className="max-width">
        <Link href='/' aria-label="Strona główna">
          <Logo />
        </Link>
        <ul className="socials">
          {socials.map((social, i) => (
            <li key={i}>
              <a href={social.url} target="_blank" rel='noopener' aria-label={social.name}>
                {social.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
 
export default Nav;