import Markdown from '@/components/ui/markdown';
import styles from './PasswordChange.module.scss';
import PasswordChangeForm from './PasswordChange_Form';

const PasswordChange = () => {
  return (
    <section className={styles['PasswordChange']}>
      <Markdown.h1>Ustaw **nowe** hasło</Markdown.h1>
      <PasswordChangeForm />
    </section>
  );
};

export default PasswordChange;
