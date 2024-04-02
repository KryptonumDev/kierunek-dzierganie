import styles from './CertificateHero.module.scss';
import type { CertificateHeroTypes } from './CertificateHero.types';

const CertificateHero = ({  }: CertificateHeroTypes) => {
  return (
    <section className={styles['CertificateHero']}>
      Tutaj będzie podstrona gdzie można dostać certyfikat  
    </section>
  );
};

export default CertificateHero;