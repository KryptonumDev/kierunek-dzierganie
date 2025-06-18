import Markdown from '@/components/ui/markdown';
import styles from './PasswordChangeEmail.module.scss';
import PasswordChangeEmailForm from './PasswordChangeEmail_Form';
import Link from 'next/link';

const PasswordChangeEmail = () => {
  return (
    <section className={styles['PasswordChangeEmail']}>
      <Markdown.h1>Przypomnij **hasło**</Markdown.h1>
      <Markdown>Aby zresetować hasło **wpisz adres e-mail**</Markdown>
      <PasswordChangeEmailForm />
      <Link
        className={'link ' + styles.link}
        href='/moje-konto/autoryzacja'
      >
        Wróć do logowania
      </Link>
    </section>
  );
};

export default PasswordChangeEmail;
