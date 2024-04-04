import Markdown from '@/components/ui/markdown';
import styles from './SuggestedCourses.module.scss';
import type { SuggestedCoursesTypes } from './SuggestedCourses.types';
import Img from '@/components/ui/image';
import AddToCartButton from './AddToCartButton';

const SuggestedCourses = ({ heading, paragraph, courses }: SuggestedCoursesTypes) => {
  if (!courses.length) return null;

  const mappedComplexity = {
    1: 'Dla początkujących',
    2: 'Dla średniozaawansowanych',
    3: 'Dla zaawansowanych',
  };

  return (
    <section className={styles['SuggestedCourses']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <div className={styles.courses}>
        {courses.map(({ name, price, course: { image, complexity, _id, type } }, index) => (
          <div key={index}>
            <p className={styles.tag}>{mappedComplexity[complexity as keyof typeof mappedComplexity]}</p>
            <Img
              data={image}
              sizes=''
            />
            <div>
              <Markdown.h3>{name}</Markdown.h3>
              <p className={styles.price}>{`${price / 100},00 zł`}</p>
            </div>
            <AddToCartButton
              id={_id}
              type={type}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestedCourses;
