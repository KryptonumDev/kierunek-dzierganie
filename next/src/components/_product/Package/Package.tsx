import Markdown from '@/components/ui/markdown';
import ProductCard from '@/components/ui/ProductCard';
import PackageCoursesModal from '@/components/_product/Package/PackageCoursesModal';
import styles from './Package.module.scss';
import type { PackageTypes } from './Package.types';

const Package = ({ product, heading, paragraph, courses }: PackageTypes) => {
  const validCourses = [...courses, ...courses, ...courses, ...courses, ...courses, ...courses, ...courses, ...courses, ...courses].filter(Boolean);
  const alwaysVisibleCount = 4;
  const visibleCourses = validCourses.slice(0, alwaysVisibleCount);

  return (
    <section className={`${styles['Package']} sec-wo-margin`}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
      </header>
      <div className={styles.list}>
        <Arrow />
        <ProductCard data={product} />
        <div className={styles['cards']}>
          <p>Pakiet zawiera ({validCourses.length})</p>
          {[...visibleCourses].map((course, index) => (
            <ProductCard
              horizontal={true}
              key={`${course._id}-preview-${index}`}
              data={course}
            />
          ))}
          <PackageCoursesModal courses={validCourses} />
        </div>
      </div>
    </section>
  );
};

export default Package;

const Arrow = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='285'
    height='121'
    fill='none'
  >
    <path
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      d='M279.184 84.581c-17-46-43-65-90-55.63-28.654 5.713-69.287 25.419-87.607 42.773-19.014 18.012-6.907 24.418 0 22.179 14.055-4.558 26.821-33.144 25.346-64.952C125.335-5.309 95.384.846 81.77 13.496 65.137 28.95 52.916 58.542 63.156 62.216c12.674 4.548 13.272-7.328 10.697-15.046-3.172-9.508-23.37-63.172-59.407-40.396-34.286 21.67 8.841 80.66 31.284 109.703 3.013 3.9 6.987 4.761 7.304 0'
    />
    <path
      stroke='#E5D8D4'
      strokeLinecap='round'
      strokeWidth='1.5'
      d='M261.026 77.186c3.498 2.912 12.122 8.46 18.631 7.357M282.678 64.656c.819 4.478 1.419 14.715-2.738 19.844'
    />
  </svg>
);
