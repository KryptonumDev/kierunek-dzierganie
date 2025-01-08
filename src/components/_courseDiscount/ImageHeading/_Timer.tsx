'use client';

import { useCountdown } from '@/utils/countdown';
import { TimerProps } from '../TimerBox/TimerBox.types';
import styles from './ImageHeading.module.scss';

const Timer = ({ expirationDate }: TimerProps) => {
  const { minutes, seconds } = useCountdown(expirationDate);

  return (
    <div
      className={styles.timer}
      data-end={(minutes === '00' && seconds === '00') || !expirationDate}
    >
      Promocja kończy się za
      <div>
        <span>{minutes || '00'}</span> minut
        <span>{seconds || '00'}</span> sekund
      </div>
    </div>
  );
};

export default Timer;
