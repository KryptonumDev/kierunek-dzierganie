import styles from './HeroBackground.module.scss';
import type { HeroBackgroundTypes } from './HeroBackground.types';

const HeroBackground = ({ data }: HeroBackgroundTypes) => {
  console.log(data);
  return <section className={styles['HeroBackground']}></section>;
};

export default HeroBackground;
