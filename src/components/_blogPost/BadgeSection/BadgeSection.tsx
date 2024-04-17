import styles from './BadgeSection.module.scss';
import type { BadgeSectionTypes } from './BadgeSection.types';

const BadgeSection = ({ badge }: BadgeSectionTypes) => {
  return (
    <div className={styles['BadgeSection']}>
      <p>{badge}</p>
    </div>
  );
};

export default BadgeSection;
