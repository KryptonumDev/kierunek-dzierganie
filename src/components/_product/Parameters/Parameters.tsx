import styles from './Parameters.module.scss';
import type { Props } from './Parameters.types';

const Parameters = ({ parameters }: Props) => {
  return (
    <section className={styles['Parameters']}>
      <ul>
        {parameters?.map((param) => (
          <li key={param.name}>
            <strong>{param.name}</strong>
            <span>{param.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Parameters;
