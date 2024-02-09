import Error from '@/components/ui/Error';
import Textarea from './_Textarea';
import styles from './Input.module.scss';
import type { Props } from './Input.types';

const Input = ({ register, label, errors, textarea = false, ...props }: Props) => {
  return (
    <label
      className={styles['Input']}
      aria-invalid={!!errors[register.name]}
    >
      <p>
        <span dangerouslySetInnerHTML={{ __html: label }} />
        <Error error={errors[register.name]?.message?.toString()} />
      </p>
      {textarea ? (
        <Textarea
          {...register}
          name={register.name}
          {...props}
        />
      ) : (
        <input
          {...register}
          name={register.name}
          {...props}
        />
      )}
    </label>
  );
};

export default Input;
