import styles from './Pagination.module.scss';
import type { PaginationTypes } from './Pagination.types';

const Pagination = ({ currentPage, numPages, pathPrefix }: PaginationTypes) => {
  console.log(currentPage, numPages, pathPrefix);
  return <section className={styles['Pagination']}></section>;
};

export default Pagination;
