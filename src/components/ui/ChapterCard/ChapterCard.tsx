import Button from '../Button';
import Img from '../image';
import styles from './ChapterCard.module.scss';
import type { Props } from './ChapterCard.types';

const ChapterCard = ({ name, image, description, lessons, courseSlug, number }: Props) => {
  return (
    <div className={styles['chapterCard']}>
      <div>
        <div className={styles['image-wrap']}>
          <Img
            data={image}
            sizes='380px'
          />
          <span className={styles['badge']}>
            {lessons.reduce((acc, lesson) => acc + lesson.lengthInMinutes, 0)} minut oglądania
          </span>
        </div>
        <h2>
          <span>Moduł {number}:</span> {name}
        </h2>
        <p>{description}</p>
      </div>
      <div className={styles['flex']}>
        <span>Ukończono 0%</span>
        <Button href={`/moje-konto/kursy/${courseSlug}/${lessons[0]?.slug}`}>Oglądaj</Button>
      </div>
    </div>
  );
};

export default ChapterCard;
