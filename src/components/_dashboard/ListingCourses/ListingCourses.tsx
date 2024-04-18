import CourseCard from '@/components/ui/CourseCard';
import styles from './ListingCourses.module.scss';
import type { Props } from './ListingCourses.types';
import FeaturedCourseCard from '@/components/ui/FeaturedCourseCard';

const ListingCourses = ({ courses }: Props) => {
  return (
    <section className={styles['ListingCourses']}>
      <h1>
        Moje <strong>kursy</strong>
      </h1>
      <FeaturedCourseCard
        name={courses[0]!.name}
        slug={courses[0]!.slug}
        image={courses[0]!.image}
        complexity={courses[0]!.complexity}
        courseLength={courses[0]!.courseLength}
        progressPercentage={courses[0]!.progressPercentage}
        excerpt={courses[0]!.excerpt}
      />
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
