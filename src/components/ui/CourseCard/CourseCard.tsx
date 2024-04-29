import { courseComplexityEnum } from '@/global/constants';
import Button from '../Button';
import Img from '../image';
import styles from './CourseCard.module.scss';
import type { Props } from './CourseCard.types';
import PercentChart from '../PercentChart';
import Link from 'next/link';

const CourseCard = ({ name, slug, image, complexity, progressPercentage }: Props) => {
  return (
    <Link
      className={styles['CourseCard']}
      href={`/moje-konto/kursy/${slug}`}
    >
      <div className={styles['image-wrap']}>
        <span
          style={{
            color: courseComplexityEnum[complexity].color,
            backgroundColor: courseComplexityEnum[complexity].background,
          }}
          className={styles['badge']}
        >
          <span>{courseComplexityEnum[complexity].name}</span>
        </span>
        <div className={styles.imageWrapper}>
          <Img
            data={image}
            sizes='380px'
          />
        </div>
      </div>
      {/* <small>Długość kursu: {courseLength}</small> */}
      <h3>{name}</h3>
      <div className={styles['flex']}>
        <p>
          Ukończono <PercentChart p={progressPercentage} />
        </p>
        <Button href={`/moje-konto/kursy/${slug}`}>Oglądaj</Button>
      </div>
    </Link>
  );
};

export default CourseCard;
