import Markdown from '@/components/ui/markdown';
import styles from './SuccessPasswordChange.module.scss';
import Button from '@/components/ui/Button';

const SuccessPasswordChange = () => {
  return (
    <section className={styles['SuccessPasswordChange']}>
      <Markdown.h1>**Sukces!** Poprawnie zmieniliśmy Twoje hasło</Markdown.h1>
      <Button
        href='/moje-konto/kursy'
      >
        Moje konto
      </Button>
    </section>
  );
};

export default SuccessPasswordChange;
