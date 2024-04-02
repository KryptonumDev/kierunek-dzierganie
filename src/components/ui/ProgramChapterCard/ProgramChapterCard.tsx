'use client';
import { useMemo } from 'react';
import Button from '../Button';
import Img from '../image';
import styles from './ProgramChapterCard.module.scss';
import type { Props } from './ProgramChapterCard.types';
import PercentChart from '../PercentChart';

const ProgramChapterCard = ({ name, image, description, lessons, courseSlug, number, progress }: Props) => {
  const completionPercentage = useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    for (const lessonId in progress) {
      totalLessons++;
      if (progress[lessonId]!.ended) {
        completedLessons++;
      }
    }

    // if 0 lessons, return to avoid division by 0
    if (totalLessons === 0) {
      return 0;
    }

    const completionPercentage = (completedLessons / totalLessons) * 100;
    return completionPercentage;
  }, [progress]);

  const firstUnendedLesson = lessons.find((lesson) => !progress[lesson._id]?.ended) || lessons[0]!;
  const lengthInMinutes = lessons.reduce((acc, lesson) => acc + lesson.lengthInMinutes, 0);

  return (
    <div className={styles['programChapterCard']}>
      <Img
        data={image}
        sizes='380px'
      />
      <div className={styles['content']}>
        <div>
          <p>
            Długość rozdziału: {lengthInMinutes}{' '}
            {lengthInMinutes === 1 ? 'minuta' : lengthInMinutes > 1 && lengthInMinutes < 5 ? 'minuty' : 'minut'}
          </p>
          <h2>
            <span>Moduł {number}:</span> {name}
          </h2>
          <p>{description}</p>
        </div>
        <div className={styles['flex']}>
          <span>
            Ukończono <PercentChart p={completionPercentage} />
          </span>
          <Button href={`/moje-konto/kursy/${courseSlug}/${firstUnendedLesson.slug}`}>Oglądaj</Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramChapterCard;
