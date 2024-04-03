import styles from './ProgramChapters.module.scss';
import type { ProgramChaptersTypes } from './ProgramChapters.types';
import ProgramChapterCard from '@/components/ui/ProgramChapterCard';

const ProgramChapters = ({ courses_progress, course }: ProgramChaptersTypes) => {
  return (
    <section className={styles['ProgramChapters']}>
      <h1>{course.name}</h1>
      <div className={styles['grid']}>
        <Arrow />
        <div className={styles['circle']}>Tu jesteśmy!</div>
        {/* TODO: add unblock time, and blocking functionality */}
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

const Arrow = () => (
  <svg
    width='398'
    height='1158'
    viewBox='0 0 398 1158'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M221.514 2.00001C124.848 -7.99999 -32.5028 72.6 7.49719 183C57.4972 321 327.508 275 285.508 183C234.4 71.0492 16.5078 233 59.5078 387.5C75.5052 429 128.7 519.8 213.5 551C298.3 582.2 254.176 609.333 221.514 619C121.176 649.667 -25.7 748.8 189.5 900C458.5 1089 467.5 694 206.5 802C-54.5 910 -3.5 1083.5 172.5 1143.5'
      stroke='#EFE8E7'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M173.687 1144.32C168.547 1147.52 156.005 1152.24 146.96 1145.46'
      stroke='#EFE8E7'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M173.691 1143.04C172.56 1137.09 167.52 1124.67 156.404 1122.62'
      stroke='#EFE8E7'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
