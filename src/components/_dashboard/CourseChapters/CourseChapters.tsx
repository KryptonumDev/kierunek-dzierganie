import ChapterCard from '@/components/ui/ChapterCard';
import styles from './CourseChapters.module.scss';
import type { Props } from './CourseChapters.types';
import { useMemo } from 'react';
import PercentChart from '@/components/ui/PercentChart';
import Link from 'next/link';

function CourseChapters({ courses_progress, course }: Props) {
  const completionPercentage = useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    for (const sectionId in courses_progress.progress) {
      const lessons = courses_progress.progress[sectionId];
      for (const lessonId in lessons) {
        totalLessons++;
        if (lessons[lessonId]!.ended) {
          completedLessons++;
        }
      }
    }

    // if 0 lessons, return to avoid division by 0
    if (totalLessons === 0) {
      return 0;
    }

    const completionPercentage = (completedLessons / totalLessons) * 100;
    return completionPercentage;
  }, [courses_progress]);

  return (
    <section className={styles['CourseChapters']}>
      <div className={styles['title']}>
        <h1>{course.name}</h1>
        <p>
          Ukończono <PercentChart p={completionPercentage} />
        </p>
      </div>
      <div className={styles['grid']}>
        <Link
          className={`${styles.returnLink} link`}
          href={'/moje-konto/kursy'}
        >
          <ChevronRight />
          Wszystkie kursy
        </Link>
        {course.chapters.map((chapter, index) => (
          <ChapterCard
            key={index}
            name={chapter.chapterName}
            image={chapter.chapterImage}
            description={chapter.chapterDescription}
            lessons={chapter.lessons}
            courseSlug={course.slug}
            number={index + 1}
            progress={courses_progress.progress[chapter._id]!}
          />
        ))}
      </div>
    </section>
  );
}

export default CourseChapters;

function ChevronRight() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      fill='none'
    >
      <path
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12.813 4.375L7.186 10l5.625 5.625'
      ></path>
    </svg>
  );
}
