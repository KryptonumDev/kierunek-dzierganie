import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import styles from './TilesIcon.module.scss';
import type { Props } from './TilesIcon.types';

const TilesIcon = ({ heading, paragraph, list }: Props) => {
  return (
    <section className={styles['TilesIcon']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <div className={styles.list}>
        {list.map(({ icon, title, description }, i) => (
          <div
            key={i}
            className={styles.item}
          >
            <div className={styles.icon}>
              <Img
                data={icon}
                sizes='32px'
                width={32}
                height={32}
              />
            </div>
            <Markdown.h3>{title}</Markdown.h3>
            <Markdown>{description}</Markdown>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TilesIcon;
