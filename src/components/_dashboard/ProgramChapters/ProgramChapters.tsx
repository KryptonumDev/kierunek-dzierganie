import styles from './ProgramChapters.module.scss';
import type { ProgramChaptersTypes } from './ProgramChapters.types';
import ProgramChapterCard from '@/components/ui/ProgramChapterCard';

const ProgramChapters = ({ courses_progress, course }: ProgramChaptersTypes) => {
  return (
    <section className={styles['ProgramChapters']}>
      <h1>{course.name}</h1>
      <div className={styles['grid']}>
        {course.chapters.map((chapter, index) => {
          let circleType: '1' | '2' | '3' | '4' | '5' = '1';
          let timeLeft = 0;

          const unlockTime = new Date(chapter.dateOfUnlock!);
          const currentTime = new Date();

          // check if chapter dateOfUnlock is already passed
          if (unlockTime > currentTime) {
            circleType = '4';
            timeLeft = unlockTime.getTime() - currentTime.getTime();
            // check if all lessons completed
          } else if (chapter.lessons.every((lesson) => courses_progress.progress[chapter._id]![lesson._id]?.ended)) {
            circleType = '3';
            // check if any lesson is completed
          } else if (chapter.lessons.some((lesson) => courses_progress.progress[chapter._id]![lesson._id]?.ended)) {
            circleType = '2';
            //if next chapter also unlocked, change circleType to 5
          } else if (course.chapters[index + 1] && new Date(course.chapters[index + 1]!.dateOfUnlock!) < currentTime) {
            circleType = '5';
          }

          return (
            <ProgramChapterCard
              key={index}
              name={chapter.chapterName}
              image={chapter.chapterImage}
              description={chapter.chapterDescription}
              lessons={chapter.lessons}
              courseSlug={course.slug}
              number={index + 1}
              progress={courses_progress.progress[chapter._id]!}
              circleType={circleType}
              timeLeft={timeLeft}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ProgramChapters;
