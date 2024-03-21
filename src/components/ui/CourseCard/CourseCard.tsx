import Button from '../Button';
import Img from '../image';
import styles from './CourseCard.module.scss';
import type { Props } from './CourseCard.types';

const complexityEnum = {
  1: {
    name: 'Dla początkujących',
    background: 'var(--primary-300)',
    color: 'var(--primary-800)',
  },
  2: {
    name: 'Dla średnio zaawansowanych',
    background: 'var(--primary-400)',
    color: 'var(--primary-800)',
  },
  3: {
    name: 'Dla zaawansowanych',
    background: 'var(--primary-700)',
    color: 'var(--primary-100)',
  },
};

const CourseCard = ({ name, slug, image, complexity, courseLength }: Props) => {
  return (
    <div className={styles['CourseCard']}>
      <div className={styles['image-wrap']}>
        <span
          style={{
            color: complexityEnum[complexity].color,
            backgroundColor: complexityEnum[complexity].background,
          }}
          className={styles['badge']}
        >
          {complexityEnum[complexity].name}
        </span>
        <Img
          data={image}
          sizes='380px'
        />
      </div>
      <small>Długość kursu: {courseLength}</small>
      <h3>{name}</h3>
      <div className={styles['flex']}>
        <p>Ukończono 0%</p>
        <Button href={`/moje-konto/kursy/${slug}`}>Oglądaj</Button>
      </div>
    </div>
  );
};

export default CourseCard;
