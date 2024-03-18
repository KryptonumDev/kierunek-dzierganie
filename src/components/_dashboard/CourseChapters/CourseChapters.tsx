import ChapterCard from '@/components/ui/ChapterCard';
import styles from './CourseChapters.module.scss';
import type { Props } from './CourseChapters.types';

function CourseChapters({ course }: Props) {
  return (
    <section className={styles['CourseChapters']}>
      <div className={styles['title']}>
        <h1>{course.name}</h1>
        <p>
          Ukończono <span>0%</span>
        </p>
      </div>
      <div className={styles['grid']}>
        {course.chapters.map((chapter, index) => (
          <ChapterCard
            key={index}
            name={chapter.chapterName}
            image={chapter.chapterImage}
            description={chapter.chapterDescription}
            lessons={chapter.lessons}
            courseSlug={course.slug}
            number={index + 1}
          />
        ))}
      </div>
    </section>
  );
}

export default CourseChapters;
