import Markdown from '@/components/ui/markdown';
import styles from './Header.module.scss';
import CopyToClipboard from '@/components/ui/CopyToClipboard';
import type { HeaderTypes } from './Header.types';

const Header = ({ heading, description, tel, email }: HeaderTypes) => {
  return (
    <section className={styles['Header']}>
      <Markdown.h2>{heading}</Markdown.h2>
      <Markdown className={styles.description}>{description}</Markdown>
      {(tel || email) && (
        <div className={styles.information}>
          {email && (
            <span className={styles.emailInformation}>
              {email}
              <CopyToClipboard copy={email} />
            </span>
          )}
          {tel && (
            <span className={styles.telInformation}>
              {tel}
              <CopyToClipboard copy={tel} />
            </span>
          )}
        </div>
      )}
    </section>
  );
};

export default Header;
