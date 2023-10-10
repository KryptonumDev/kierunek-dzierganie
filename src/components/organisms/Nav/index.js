import fetchData from '@/utils/fetchData';
import styles from './styles.module.scss';
import { Facebook, Instagram, Logo, Youtube } from '@/components/atoms/Icons';
import Link from 'next/link';

const Nav = async () => {
  const { global } = await getData();
  const socials = [
    {
      name: 'Facebook',
      url: global.facebook,
      icon: <Facebook />
    },
    {
      name: 'Instagram',
      url: global.instagram,
      icon: <Instagram />
    },
    {
      name: 'YouTube',
      url: global.youtube,
      icon: <Youtube />
    },
  ]
  return (
    <nav className={styles.wrapper}>
      <div className="max-width">
        <Link href='/' aria-label="Strona główna">
          <Logo role="img" />
        </Link>
        <ul>
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

const getData = async () => {
  return await fetchData(`
    query {
      global: Global(id: "global") {
        facebook
        instagram
        youtube
      }
    }
  `);
}
 
export default Nav;