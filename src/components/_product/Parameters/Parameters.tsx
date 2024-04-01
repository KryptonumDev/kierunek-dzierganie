import styles from './Parameters.module.scss';
import type { Props } from './Parameters.types';

const Parameters = ({ parameters }: Props) => {
  return (
    <section className={styles['Parameters']}>
      <ul>
        {parameters?.map(({ name, value }, i) => (
          <li key={i}>
            <strong>{name}</strong>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Parameters;
