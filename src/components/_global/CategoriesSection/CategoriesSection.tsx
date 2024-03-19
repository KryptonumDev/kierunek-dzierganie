import styles from './CategoriesSection.module.scss';
import type { CategoriesSectionTypes } from './CategoriesSection.types';

const CategoriesSection = ({ data }: CategoriesSectionTypes) => {
  console.log(data);
  return <section className={styles['CategoriesSection']}></section>;
};

export default CategoriesSection;
