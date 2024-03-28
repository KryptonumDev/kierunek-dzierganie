import styles from './TableSection.module.scss';
import type { TableSectionTypes } from './TableSection.types';

const TableSection = ({ table }: TableSectionTypes) => {
  console.log(table);
  return <section className={styles['TableSection']}></section>;
};

export default TableSection;
