import styles from './DiscountHero.module.scss';
import type { DiscountHeroTypes } from './DiscountHero.types';

export default function DiscountHero({}: DiscountHeroTypes) {
  return <div className={styles.discountHero}></div>;
}
