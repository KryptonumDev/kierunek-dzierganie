import styles from './styles.module.scss';
import { Facebook, Instagram, Logo, Youtube } from '@/components/atoms/Icons';
import Link from 'next/link';
import { Fetch } from '@/utils/fetch-query';

const Nav = async () => {
  const { data: { global } } = await getData();
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
          <Logo />
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
  const { body: { data } } = await Fetch({
    query: `
      global: Global(id: "global") {
        facebook
        instagram
        youtube
      }
    `,
  })
  return { data };
}
 
export default Nav;