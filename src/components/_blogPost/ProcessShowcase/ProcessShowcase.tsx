import styles from './ProcessShowcase.module.scss';
import type { ProcessShowcaseTypes } from './ProcessShowcase.types';

const ProcessShowcase = ({ list }: ProcessShowcaseTypes) => {
  console.log(list);
  return <section className={styles['ProcessShowcase']}></section>;
};

export default ProcessShowcase;
