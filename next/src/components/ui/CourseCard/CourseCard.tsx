import { courseComplexityEnum } from '@/global/constants';
import Link from 'next/link';
import Button from '../Button';
import Img from '../image';
import PercentChart from '../PercentChart';
import styles from './CourseCard.module.scss';
import type { Props } from './CourseCard.types';

const CourseCard = ({ name, slug, image, complexity, progressPercentage }: Props) => {
  return (
    <div className={styles['CourseCard']}>
      <Link
        tabIndex={-1}
        href={`/moje-konto/kursy/${slug}`}
        aria-label={name}
      />
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
        <nav>
          <Link
            className={styles.relatedFiles}
            href={`/moje-konto/kursy/${slug}#materialy-do-pobrania`}
          >
            Zobacz materiały do pobrania
          </Link>
          <Button href={`/moje-konto/kursy/${slug}`}>Oglądaj</Button>
        </nav>
      </div>
    </div>
  );
};

export default CourseCard;
