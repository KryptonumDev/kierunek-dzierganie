import styles from './ProcessComponent.module.scss';
import type { ProcessComponentTypes } from './ProcessComponent.types';

const ProcessComponent = ({ list }: ProcessComponentTypes) => {
  console.log(list);
  return <section className={styles['ProcessComponent']}></section>;
};

export default ProcessComponent;
