import Markdown from '@/components/ui/markdown';
import styles from './Contents.module.scss';
import type { Props } from './Contents.types';

const Contents = ({ data, isPrivacyPolicy }: Props) => {
  return (
    <section className={styles['Contents']}>
      {data.map(({ title, description }, index) => {
        return (
          <div
            key={index}
            className={styles.content}
            data-isPrivacyPolicy={isPrivacyPolicy}
          >
            <Markdown.h2 className={styles.title}>{title}</Markdown.h2>
            <Markdown className={styles.description}>{description}</Markdown>
          </div>
        );
      })}
    </section>
  );
};

export default Contents;
