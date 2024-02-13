import Img from '@/components/ui/image';
import styles from './HeroColumn.module.scss';
import type { Props } from './HeroColumn.types';
import Markdown from '@/components/ui/markdown';

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
        sizes='(max-width: 999px) 100vw, (min-width: 1280px) 50vw, 600px'
      />
    </section>
  );
};

export default HeroColumn;
