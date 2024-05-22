import Markdown from '@/components/ui/markdown';
import Img from '@/components/ui/image';
import styles from './TilesIcon.module.scss';
import type { Props } from './TilesIcon.types';

const TilesIcon = ({ heading, paragraph, list, index }: Props) => {
  const HeadingComponent = index === 0 ? Markdown.h1 : Markdown.h2;
  const TitleComponent = index === 0 ? Markdown.h2 : Markdown.h3;

  return (
    <section className={styles['TilesIcon']}>
      <header>
        <HeadingComponent>{heading}</HeadingComponent>
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
            <TitleComponent>{title}</TitleComponent>
            <Markdown>{description}</Markdown>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TilesIcon;
