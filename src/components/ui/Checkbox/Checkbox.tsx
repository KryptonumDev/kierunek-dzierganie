import Error from '@/components/ui/Error';
import styles from './Checkbox.module.scss';
import type { Props } from './Checkbox.types';

const Checkbox = ({ register, label, error, ...props }: Props) => {
  return (
    <label
      className={styles['Checkbox']}
      aria-invalid={!!error}
    >
      <div className={styles.icon}>
        <input
          {...register}
          name={register.name}
          type='checkbox'
          {...props}
        />
        <Checkmark />
      </div>
      <p>
        {label}
        <Error error={error} />
      </p>
    </label>
  );
};

export default Checkbox;

const Checkmark = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='14'
    height='12'
    fill='none'
    viewBox='0 0 14 12'
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.25 1L4.5 11 .75 7.25'
    ></path>
  </svg>
);
