'use client';
import { useMemo } from 'react';
import Button from '../Button';
import Img from '../image';
import styles from './ProgramChapterCard.module.scss';
import type { Props } from './ProgramChapterCard.types';
import PercentChart from '../PercentChart';
import { formatTime } from '@/utils/format-time';
import Link from 'next/link';

const circleTypes = {
  '1': {
    title: 'Gotowe do zaczęcia!',
    background: 'var(--primary-400, #E5D8D4)',
    mobile: false,
  },
  '2': {
    title: 'W trakcie!',
    background: 'var(--primary-300, #EFE8E7)',
    mobile: false,
  },
  '3': {
    title: 'Ukończone!',
    background: 'var(--success-400, #99AB9C)',
    mobile: false,
  },
  '4': {
    title: 'Dostęp odblokuje się za',
    background: 'var(--primary-300, #EFE8E7)',
    mobile: true,
  },
  '5': {
    title: 'Odblokowane!',
    background: 'var(--primary-300, #EFE8E7)',
    mobile: false,
  },
};

const ProgramChapterCard = ({
  name,
  image,
  description,
  lessons,
  courseSlug,
  number,
  progress,
  circleType,
  timeLeft,
}: Props) => {
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
    <div className={`${styles['programChapterCard']} ${timeLeft ? styles['blocked'] : ''}`}>
      <Link
        tabIndex={-1}
        href={`/moje-konto/kursy/${courseSlug}/${firstUnendedLesson.slug}`}
      />
      <div
        style={{ backgroundColor: circleTypes[circleType].background }}
        className={`${styles['circle']} ${circleTypes[circleType].mobile ? styles['mobile'] : ''}`}
      >
        {circleTypes[circleType].title} {circleType === '4' && formatTime(timeLeft)}
      </div>
      <div className={styles['image-wrap']}>
        <Img
          data={image}
          sizes='380px'
        />
      </div>
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
          {timeLeft ? (
            <Button disabled>Oglądaj</Button>
          ) : (
            <Button href={`/moje-konto/kursy/${courseSlug}/${firstUnendedLesson.slug}`}>Oglądaj</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramChapterCard;
