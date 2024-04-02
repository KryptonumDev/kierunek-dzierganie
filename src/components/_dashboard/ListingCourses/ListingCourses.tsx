import CourseCard from '@/components/ui/CourseCard';
import styles from './ListingCourses.module.scss';
import type { Props } from './ListingCourses.types';

const ListingCourses = ({ courses }: Props) => {
  return (
    <section className={styles['ListingCourses']}>
      <h1>
        Moje <strong>kursy</strong>
      </h1>
      {/* TODO: ostatni oglądany kurs */}
      {/* TODO: filters */}
      <div className={styles['grid']}>
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            name={course.name}
            slug={course.slug}
            image={course.image}
            complexity={course.complexity}
            courseLength={course.courseLength}
            progressPercentage={course.progressPercentage}
          />
        ))}
      </div>
    </section>
  );
};

export default ListingCourses;
