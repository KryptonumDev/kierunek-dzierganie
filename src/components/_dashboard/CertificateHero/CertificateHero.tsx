import Markdown from '@/components/ui/markdown';
import styles from './CertificateHero.module.scss';

const CertificateHero = () => {
  return (
    <section className={styles['CertificateHero']}>
      <Markdown.h2>**Gratulacje!** Udało Ci się ukończyć kurs</Markdown.h2>
      <Markdown>
        To wielki krok dla Twojego rozwoju! Poniżej znajdziesz certyfikat, który przygotowaliśmy specjalnie dla Ciebie
      </Markdown>
    </section>
  );
};

export default CertificateHero;
