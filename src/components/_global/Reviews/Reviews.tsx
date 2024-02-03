import Markdown from '@/components/ui/markdown';
import styles from './Reviews.module.scss';
import type { Props } from './Reviews.types';

const Reviews = ({ heading, list }: Props) => {
  return (
    <section className={styles['Reviews']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
    </section>
  );
};

export default Reviews;