import styles from './Divider.module.scss';
import { Flower } from './_Flower';

const Divider = () => {
  return (
    <div className={styles['Divider']}>
      <div className={styles.icon}>
        <Flower />
      </div>
    </div>
  );
};

export default Divider;
