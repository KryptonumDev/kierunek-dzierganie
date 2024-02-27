import Markdown from '@/components/ui/markdown';
import styles from './Header.module.scss';
import CopyToClipboard from '@/components/ui/CopyToClipboard';
import type { Props } from './Header.types';

const Header = ({ data: { header_Heading, header_Description, tel, email } }: Props) => {
  return (
    <section className={styles['Header']}>
      <Markdown.h2>{header_Heading}</Markdown.h2>
      <Markdown className={styles.description}>{header_Description}</Markdown>
      {tel && email && (
        <div className={styles.information}>
          <span className={styles.emailInformation}>
            {email}
            <CopyToClipboard copy={email} />
          </span>
          <span className={styles.telInformation}>
            {tel}
            <CopyToClipboard copy={tel} />
          </span>
        </div>
      )}
    </section>
  );
};

export default Header;
