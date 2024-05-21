'use client';
import { useMemo } from 'react';
import Button from '../Button';
import Img from '../image';
import styles from './ChapterCard.module.scss';
import type { Props } from './ChapterCard.types';
import PercentChart from '../PercentChart';
import Link from 'next/link';
import { prettifyDuration } from '@/utils/prettify-duration';

const ChapterCard = ({ name, image, description, lessons, courseSlug, number, progress }: Props) => {
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

  return (
    <div className={styles['chapterCard']}>
      <Link
        href={`/moje-konto/kursy/${courseSlug}/${firstUnendedLesson.slug}`}
        tabIndex={-1}
        aria-label={`lekcja: Moduł ${number}: ${name}`}
      />
      <div>
        <div className={styles['image-wrap']}>
          <Img
            data={image}
            sizes='380px'
          />
          <span className={styles['badge']}>
            {prettifyDuration(lessons.reduce((acc, lesson) => acc + lesson.lengthInMinutes, 0))}
          </span>
        </div>
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
  );
};

export default ChapterCard;
