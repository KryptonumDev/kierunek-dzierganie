import CourseCard from '@/components/ui/CourseCard';
import styles from './ListingCourses.module.scss';
import type { Props } from './ListingCourses.types';

const ListingCourses = ({ courses }: Props) => {

  return (
    <section className={styles['ListingCourses']}>
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
          />
        ))}
      </div>
    </section>
  );
};

export default ListingCourses;
