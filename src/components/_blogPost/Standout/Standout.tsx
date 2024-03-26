import styles from './Standout.module.scss';
import type { StandoutTypes } from './Standout.types';

const Standout = ({ heading, paragraph }: StandoutTypes) => {
  console.log(heading, paragraph);
  return <section className={styles['Standout']}></section>;
};

export default Standout;
