import styles from './ProgramChapters.module.scss';
import type { ProgramChaptersTypes } from './ProgramChapters.types';
import ProgramChapterCard from '@/components/ui/ProgramChapterCard';

const ProgramChapters = ({ courses_progress, course }: ProgramChaptersTypes) => {
  return (
    <section className={styles['ProgramChapters']}>
      <h1>{course.name}</h1>
      <div className={styles['grid']}>
        {course.chapters.map((chapter, index) => (
          <ProgramChapterCard
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
};

export default ProgramChapters;
