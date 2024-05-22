import styles from './FeaturedCourseCard.module.scss';
import type { Props } from './FeaturedCourseCard.types';
import Img from '../image';
import Button from '../Button';
import { courseComplexityEnum } from '@/global/constants';
import PercentChart from '../PercentChart';
import Link from 'next/link';

const FeaturedCourseCard = ({ name, slug, image, complexity, progressPercentage, excerpt }: Props) => {
  return (
    <div className={`${styles['featuredCourseCard']}`}>
      <Link
        href={`/moje-konto/kursy/${slug}`}
        tabIndex={-1}
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
        <div className={styles['bestseller']}>
          <LastWatched />
          <h2>
            <strong>Ostatnio przerabiany</strong>
          </h2>
        </div>
      </div>
      <div className={styles['data']}>
        {/* <small>Długość kursu: {courseLength}</small> */}
        <h3 className={styles['names']}>{name}</h3>
        {excerpt && <div className={styles['excerpt']}>{excerpt}</div>}
      </div>
      <div className={styles['flex']}>
        <p>
          Ukończono <PercentChart p={progressPercentage} />
        </p>
        <Button href={`/moje-konto/kursy/${slug}`}>Oglądaj</Button>
      </div>
    </div>
  );
};

export default FeaturedCourseCard;

const LastWatched = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='249'
    height='43'
    viewBox='0 0 249 43'
    fill='none'
  >
    <path
      d='M0 38.5V4C0 1.79086 1.79086 0 4 0H246.248C248.144 0 248.975 2.39233 247.488 3.56861L226.825 19.9128C225.805 20.7194 225.814 22.2693 226.843 23.0641L247.363 38.9173C248.872 40.0836 248.048 42.5 246.14 42.5H4C1.79086 42.5 0 40.7091 0 38.5Z'
      fill='#E5D8D4'
    />
  </svg>
);
