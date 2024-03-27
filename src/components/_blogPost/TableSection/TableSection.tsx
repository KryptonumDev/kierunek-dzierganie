import styles from './TableSection.module.scss';
import type { TableSectionTypes } from './TableSection.types';

const TableSection = ({ table }: TableSectionTypes) => {
  console.log(table);
  return (
    <div className={styles['TableSection']}>
      {table.map(({ title, description }, index) => (
        <div
          className={styles.item}
          key={index}
        >
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>
        </div>
      ))}
    </div>
  );
};

export default TableSection;
