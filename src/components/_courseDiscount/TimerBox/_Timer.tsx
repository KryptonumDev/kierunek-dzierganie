'use client';

import { useCountdown } from '@/utils/countdown';
import styles from './TimerBox.module.scss';
import { TimerProps } from './TimerBox.types';

const Timer = ({ expirationDate }: TimerProps) => {
  const { minutes, seconds } = useCountdown(expirationDate);

  return (
    <div
      className={styles.timer}
      data-end={minutes === '00' && seconds === '00'}
    >
      Promocja kończy się za{' '}
      <div>
        <span>{minutes || '00'}</span> minut <span>{seconds || '00'}</span> sekund
      </div>
    </div>
  );
};

export default Timer;
