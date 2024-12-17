import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './DiscountHero.module.scss';
import { DiscountHeroTypes } from './DiscountHero.types';

export default function DiscountHero({ image, heading, paragraph, index }: DiscountHeroTypes) {
  const HeadingComponent = index === 0 ? Markdown.h1 : Markdown.h2;

  return (
    <section className={styles['DiscountHero']}>
      <Img
        data={image}
        sizes='100vw'
      />
      <div className={`${styles.container} max-width`}>
        <header>
          <HeadingComponent className={styles.heading}>{heading}</HeadingComponent>
          <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        </header>
      </div>
    </section>
  );
}
