'use client';

import { useCountdown } from '@/utils/countdown';
import styles from './TimerBox.module.scss';
import { TimerProps } from './TimerBox.types';

const Timer = ({ initialMinutes }: TimerProps) => {
  const { minutes, seconds } = useCountdown(initialMinutes);
  console.log(minutes, seconds);
  return (
    <div
      className={styles.timer}
      data-end={minutes === '00' && seconds === '00'}
    >
      Promocja kończy się za{' '}
      <div>
        <span>{minutes}</span> minut i <span>{seconds}</span> sekund
      </div>
    </div>
  );
};

export default Timer;
