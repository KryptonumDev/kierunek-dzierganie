import Markdown from '@/components/ui/markdown';
import styles from './SuggestedCourses.module.scss';
import type { SuggestedCoursesTypes } from './SuggestedCourses.types';
import ProductCard from '@/components/ui/ProductCard';

const SuggestedCourses = ({ heading, paragraph, course }: SuggestedCoursesTypes) => {
  if (!course) return null;

  return (
    <section className={styles['SuggestedCourses']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.courses}>
        <ProductCard data={course} />
      </div>
    </section>
  );
};

export default SuggestedCourses;
