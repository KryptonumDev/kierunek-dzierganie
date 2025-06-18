import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './HeroColumn.module.scss';
import type { Props } from './HeroColumn.types';

const HeroColumn = ({ heading, paragraph, img, index }: Props) => {
  const HeadingComponent = index === 0 ? Markdown.h1 : Markdown.h2;

  return (
    <section className={styles['HeroColumn']}>
      <header>
        <HeadingComponent>{heading}</HeadingComponent>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <Img
        data={img}
        sizes='(max-width: 649px) 100vw, (max-width: 999px) 600px, (max-width: 1279px) 50vw, 584px'
        priority={index === 0}
      />
    </section>
  );
};

export default HeroColumn;
