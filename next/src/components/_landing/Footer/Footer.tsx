import styles from './Footer.module.scss';

const Footer = ({ title = 'Zrób mi mamo' }: { title?: 'Zrób mi mamo' | 'Kierunek Dzierganie' }) => {
  return (
    <footer className={styles['Footer']}>
      <div className='max-width'>
        <p>
          Ⓒ Stworzone przez{' '}
          <a
            href='https://kryptonum.eu/pl'
            className='link'
          >
            Kryptonum
          </a>
        </p>
        <p>
          <a
            href={title === 'Zrób mi mamo' ? 'https://www.zrobmimamo.pl/' : 'https://www.kierunekdzierganie.pl/'}
            className='link'
          >
            {title}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
