import { courseComplexityEnum } from '@/global/constants';
import Button from '../Button';
import Img from '../image';
import styles from './CourseCard.module.scss';
import type { Props } from './CourseCard.types';
import PercentChart from '../PercentChart';

const CourseCard = ({ name, slug, image, complexity, progressPercentage }: Props) => {
  return (
    <div className={styles['CourseCard']}>
      <div className={styles['image-wrap']}>
        <span
          style={{
            color: courseComplexityEnum[complexity].color,
            backgroundColor: courseComplexityEnum[complexity].background,
          }}
          className={styles['badge']}
        >
          {courseComplexityEnum[complexity].name}
        </span>
        <Img
          data={image}
          sizes='380px'
        />
      </div>
      {/* <small>Długość kursu: {courseLength}</small> */}
      <h3>{name}</h3>
      <div className={styles['flex']}>
        <p>
          Ukończono <PercentChart p={progressPercentage} />
        </p>
        <Button href={`/moje-konto/kursy/${slug}`}>Oglądaj</Button>
      </div>
    </div>
  );
};

export default CourseCard;
