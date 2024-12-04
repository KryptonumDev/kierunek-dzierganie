import CourseCard from '@/components/ui/CourseCard';
import FeaturedCourseCard from '@/components/ui/FeaturedCourseCard';
import Markdown from '@/components/ui/markdown';
import FiltersSorting from './_FiltersSorting';
import styles from './ListingCourses.module.scss';
import type { Props } from './ListingCourses.types';

const ListingCourses = ({
  categories,
  authors,
  courses,
  lastWatchedCourse,
  totalCourses,
  sort,
  lastWatchedList,
}: Props) => {
  const lastWatched = courses.find((course) => course._id === lastWatchedCourse);

  const featuredProductExcerpt = lastWatched?.excerpt ? <Markdown>{lastWatched.excerpt}</Markdown> : undefined;

  const filteredCourses = courses
    .filter(
      (el) => el._id !== lastWatchedCourse && (sort !== 'ostatnio-przerabiane' || !lastWatchedList.includes(el._id))
    )
    .sort((a, b) => Number(b.progressId) - Number(a.progressId));

  const lastWatchedCourses =
    sort === 'ostatnio-przerabiane'
      ? courses
          .filter((el) => lastWatchedList.includes(el._id))
          .sort((a, b) => lastWatchedList.indexOf(a._id) - lastWatchedList.indexOf(b._id))
          .slice(1)
      : [];

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
      <FiltersSorting
        authors={authors}
        categories={categories}
        sort={sort}
      />
      {[...lastWatchedCourses, ...filteredCourses].filter((el) => el._id !== lastWatchedCourse).length === 0 ? (
        <div className={styles['empty']}>
          <h2>Brak kursów według wybranych filtrów</h2>
        </div>
      ) : (
        <div className={styles['grid']}>
          {[...lastWatchedCourses, ...filteredCourses].map((course) => (
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
