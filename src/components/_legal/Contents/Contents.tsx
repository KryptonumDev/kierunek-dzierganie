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
            data-isprivacypolicy={isPrivacyPolicy}
          >
            <h2 className={styles.title}>
              <Markdown.span>{title}</Markdown.span>
            </h2>
            <Markdown className={styles.description}>{description}</Markdown>
          </div>
        );
      })}
    </section>
  );
};

export default Contents;
