'use client';

import { useEffect, useState } from 'react';

interface CountdownResult {
  hours: string | null;
  minutes: string | null;
  seconds: string | null;
}

export const useCountdown = (expirationDate?: string): CountdownResult => {
  const expirationTime = new Date(expirationDate || new Date()).getTime();
  const timeLeftSeconds = Math.floor((expirationTime - new Date().getTime()) / 1000) * 1000;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!timeLeftSeconds || timeLeftSeconds < 0) return;
    setTimeLeft(timeLeftSeconds);
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (!prevTime || prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeftSeconds]);

  if (timeLeftSeconds < 0) {
    return {
      hours: null,
      minutes: '00',
      seconds: '00',
    };
  }

  if (timeLeft === null) {
    return {
      hours: null,
      minutes: null,
      seconds: null,
    };
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours > 0 ? hours.toString().padStart(2, '0') : null,
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};
