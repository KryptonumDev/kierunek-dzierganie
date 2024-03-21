import styles from './PercentChart.module.scss';

export default function PercentChart({ p }: { p: number }) {
  return (
    <span className={styles['percentChart']}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='58'
        height='58'
        viewBox='0 0 58 58'
        fill='none'
      >
        <circle
          r='28'
          cx='29'
          cy='29'
          fill='transparent'
          stroke='#EFE8E7'
          strokeWidth='1px'
        ></circle>
        <circle
          r='28'
          cx='29'
          cy='29'
          fill='transparent'
          strokeLinecap="round"
          stroke='#9A827A'
          strokeWidth='1px'
          strokeDasharray={`${2 * 3.14 * 28}px`}
          strokeDashoffset={`${2 * 3.14 * 28 * ((100 - p) / 100)}px`}
        ></circle>
      </svg>
      {p}%
    </span>
  );
}
