import Error from '@/components/ui/Error';
import styles from './Radio.module.scss';
import type { Props } from './Radio.types';

const Radio = ({ register, label, errors, ...props }: Props) => {
  return (
    <label
      className={styles['Input']}
      aria-invalid={!!errors[register.name]}
    >
      <input
        {...register}
        name={register.name}
        {...props}
        type='radio'
      />
      <span className={styles['mark']} />
      <p>
        <span dangerouslySetInnerHTML={{ __html: label }} />
        <Error error={errors[register.name]?.message?.toString()} />
      </p>
    </label>
  );
};

export default Radio;
