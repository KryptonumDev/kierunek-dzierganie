import styles from './Switch.module.scss';
import type { SwitchTypes } from './Switch.types';

const Switch = ({ children, labelProps, inputProps }: SwitchTypes) => {
  return (
    <label
      className={styles['Switch']}
      {...labelProps}
    >
      <div className={styles.switcher}>
        <input
          type='checkbox'
          {...inputProps}
        />
        <div className={styles.dot}>
          <Tick className={styles.tick} />
        </div>
      </div>
      <span>{children}</span>
    </label>
  );
};

export default Switch;

const Tick = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={17}
    viewBox='0 0 16 17'
    fill='none'
    {...props}
  >
    <path
      d='m14 3.7-8.4 9.6L2 9.7'
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
