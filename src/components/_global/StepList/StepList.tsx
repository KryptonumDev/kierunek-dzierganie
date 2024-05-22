import Markdown from '@/components/ui/markdown';
import styles from './StepList.module.scss';
import type { Props } from './StepList.types';

const StepList = ({ heading, paragraph, list }: Props) => {
  return (
    <section className={`${styles['StepList']} sec-wo-margin`}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <div className={styles.list}>
        {list.map(({ title, description }, i) => (
          <div
            className={styles.item}
            key={i}
          >
            <div>
              <Markdown.h3>{title}</Markdown.h3>
              <Markdown>{description}</Markdown>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepList;
