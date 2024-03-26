import styles from './BadgeSection.module.scss';
import type { BadgeSectionTypes } from './BadgeSection.types';

const BadgeSection = ({ badge }: BadgeSectionTypes) => {
  console.log(badge);
  return <section className={styles['BadgeSection']}></section>;
};

export default BadgeSection;
