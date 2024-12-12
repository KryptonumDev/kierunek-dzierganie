'use client';

import { useEffect, useState } from 'react';

interface CountdownResult {
  minutes: string;
  seconds: string;
}

export const useCountdown = (initialMinutes: number): CountdownResult => {
  const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60);

  useEffect(() => {
    // Don't start if no initial minutes provided
    if (!initialMinutes) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [initialMinutes]);

  return {
    minutes: Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, '0'),
    seconds: (timeLeft % 60).toString().padStart(2, '0'),
  };
};
