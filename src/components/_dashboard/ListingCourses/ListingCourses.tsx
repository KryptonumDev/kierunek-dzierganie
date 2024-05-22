import CourseCard from '@/components/ui/CourseCard';
import styles from './ListingCourses.module.scss';
import type { Props } from './ListingCourses.types';
import FeaturedCourseCard from '@/components/ui/FeaturedCourseCard';
import Filters from './_Filters';
import Markdown from '@/components/ui/markdown';

const ListingCourses = ({ categories, authors, courses, lastWatchedCourse, totalCourses }: Props) => {
  const lastWatched = courses.find((course) => course._id === lastWatchedCourse);

  const featuredProductExcerpt = lastWatched?.excerpt ? <Markdown>{lastWatched.excerpt}</Markdown> : undefined;

  return (
    <section className={styles['ListingCourses']}>
      <h1>
        Moje <strong>kursy</strong> <span className={styles['total']}>{totalCourses}</span>
      </h1>
      {lastWatched && (
        <FeaturedCourseCard
          name={lastWatched.name}
          slug={lastWatched.slug}
          image={lastWatched.image}
          complexity={lastWatched.complexity}
          courseLength={lastWatched.courseLength}
          progressPercentage={lastWatched.progressPercentage}
          excerpt={featuredProductExcerpt}
        />
      )}
      <Filters
        authors={authors}
        categories={categories}
      />
      {courses.filter((el) => el._id !== lastWatchedCourse).length === 0 ? (
        <div className={styles['empty']}>
          <h2>Brak kursów według wybranych filtrów</h2>
        </div>
      ) : (
        <div className={styles['grid']}>
          {courses
            .filter((el) => el._id !== lastWatchedCourse)
            .map((course) => (
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
      )}
    </section>
  );
};

export default ListingCourses;
