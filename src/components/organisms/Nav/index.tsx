import sanityFetch from '@/utils/sanityFetch';
import styles from './styles.module.scss';
import { Facebook, Instagram, Logo, Youtube } from '@/components/atoms/Icons';
import Link from 'next/link';

type QueryProps = {
  facebook: string;
  instagram: string;
  youtube: string;
};

const Nav = async () => {
  const {
    facebook,
    instagram,
    youtube,
  }: QueryProps = await query();

  const socials = [
    {
      name: 'Facebook',
      url: facebook,
      icon: <Facebook />,
    },
    {
      name: 'Instagram',
      url: instagram,
      icon: <Instagram />,
    },
    {
      name: 'YouTube',
      url: youtube,
      icon: <Youtube />,
    },
  ];

  return (
    <nav className={styles.wrapper}>
      <div className='max-width'>
        <Link
          href='/'
          aria-label='Strona główna'
        >
          <Logo role='img' />
        </Link>
        <ul>
          {socials.map((social, i) => (
            <li key={i}>
              <a
                href={social.url}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={social.name}
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const query = async (): Promise<QueryProps> => {
  const data = await sanityFetch(/* groq */ `
    *[_id == 'global'][0] {
      facebook,
      instagram,
      youtube,
    }
  `);
  return data as QueryProps;
};

export default Nav;