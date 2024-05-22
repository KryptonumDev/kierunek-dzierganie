import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <svg
      viewBox='25 25 50 50'
      className={styles['Loader']}
    >
      <circle
        cx='50'
        cy='50'
        r='20'
        fill='none'
        stroke='currentColor'
        strokeWidth='5'
      />
    </svg>
  );
};

export default Loader;
