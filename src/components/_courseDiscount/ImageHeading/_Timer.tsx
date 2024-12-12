'use client';

import { useCountdown } from '@/utils/countdown';
import { TimerProps } from '../TimerBox/TimerBox.types';
import styles from './ImageHeading.module.scss';

const Timer = ({ initialMinutes }: TimerProps) => {
  const { minutes, seconds } = useCountdown(initialMinutes);

  return (
    <div
      className={styles.timer}
      data-end={minutes === '00' && seconds === '00'}
    >
      Promocja kończy się za
      <div>
        <span>{minutes}</span> minut
        <span>{seconds}</span> sekund
      </div>
    </div>
  );
};

export default Timer;
