import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './StepList.module.scss';
import type { Props } from './StepList.types';

const StepList = ({ image, heading, paragraph, list }: Props) => {
  return (
    <section
      className={`${styles['StepList']} sec-wo-margin`}
      data-image={!!image}
    >
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <div className={styles.container}>
        {image && (
          <Img
            data={image}
            sizes=''
          />
        )}
        <ul className={styles.list}>
          {list.map(({ title, description }, i) => (
            <li
              className={styles.item}
              key={i}
            >
              <div>
                <Markdown.h3>{title}</Markdown.h3>
                <Markdown>{description}</Markdown>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StepList;
