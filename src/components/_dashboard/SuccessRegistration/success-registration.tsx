import Markdown from '@/components/ui/markdown';
import styles from './success-registration.module.scss';
import Button from '@/components/ui/Button';

const SuccessRegistration = () => {
  return (
    <section className={styles['SuccessRegistration']}>
      <Markdown.h1>**Dziękujemy** za założenie konta!</Markdown.h1>
      <Markdown>**Zweryfikuj swój adres e-mail,** aby mieć dostęp do kursów</Markdown>
      <Button href='/'>Wróć na główną</Button>
    </section>
  );
};

export default SuccessRegistration;
