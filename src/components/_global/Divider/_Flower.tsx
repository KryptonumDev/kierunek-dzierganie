'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { easing } from '@/global/constants';

const animate = (isInView: boolean, delay?: number, duration?: number) => ({
  initial: {
    pathLength: 0,
  },
  animate: {
    pathLength: isInView ? 1 : 0,
  },
  transition: {
    duration: duration || 1.6,
    delay: delay,
    ease: easing,
  },
});

export const Flower = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '0px 0px -5% 0px', once: true });

  return (
    <svg
      ref={ref}
      data-visible={isInView}
      xmlns='http://www.w3.org/2000/svg'
      width={128}
      height={128}
      fill='none'
      stroke='#B4A29C'
    >
      <motion.path
        {...animate(isInView)}
        d='M100.271 37.872C91.608 47.995 60.635 73.052 6.056 92.3'
        stroke='#B4A29C'
        strokeLinecap='round'
      />
      <motion.path
        {...animate(isInView, 0.2, 0.8)}
        d='M20.394 87.032c3.162.433 11.028 1.212 17.192.86'
        stroke='#B4A29C'
        strokeLinecap='round'
      />
      <motion.path
        {...animate(isInView, 0.8, 0.8)}
        d='M54.894 91.881c-6.179-6.56-14.057-5.375-17.224-3.963 1.963 8.166 14.92 6.544 16.628 5.63 1.366-.732.967-1.416.596-1.667Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <motion.path
        {...animate(isInView, 0.4, 0.8)}
        d='M48.75 55.255c-.506 5.234-2.699 17.043-7.425 22.41'
        stroke='#B4A29C'
        strokeLinecap='round'
      />
      <motion.path
        {...animate(isInView, 1, 0.8)}
        d='M53.541 38.65c1.863 8.986-2.38 14.794-4.736 16.575-5.694-10.633.88-14.509 2.828-16.828 1.558-1.856 1.922-.604 1.908.254Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <motion.path
        {...animate(isInView, 1.2, 0.8)}
        d='M45.85 68.506c-.213-.926-1.248-3.6-3.689-6.887'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <motion.path
        {...animate(isInView, 1.8, 0.8)}
        d='M29.619 49.053c9.763 2.768 12.43 9.531 12.544 12.566-7.053 3.777-12.381-7.761-13.886-10.571-1.204-2.248.393-2.267 1.342-1.995Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <motion.path
        {...animate(isInView, 0.6, 0.8)}
        d='M55.916 70.224c7.25-.763 23.439-1.776 30.207.271'
        stroke='#B4A29C'
        strokeLinecap='round'
      />
      <motion.path
        {...animate(isInView, 1.2, 0.8)}
        d='M84.795 83.24C81.42 74.612 72.765 70.4 68.859 69.372c5.419 14.752 13.004 15.015 15.025 16.272 1.616 1.006 1.28-1.182.91-2.402Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <motion.path
        {...animate(isInView, 1.8, 0.8)}
        d='M106.313 74.836c-7.847-7.028-16.865-5.81-20.393-4.321 4.369 9.216 12.668 6.048 17.143 6.062 3.579.011 3.658-1.156 3.25-1.741Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <motion.path
        {...animate(isInView, 0.8, 0.8)}
        d='M85.498 45.501c-.453 1.802-2.656 6.584-7.848 11.293'
        stroke='#B4A29C'
        strokeLinecap='round'
      />
      <motion.path
        {...animate(isInView, 1.4, 0.8)}
        d='M89.95 25.747c2.234 9.466-2.074 17.133-4.506 19.783-8.218-8.857.736-18.615 2.18-20.949 1.156-1.866 2.032 0 2.326 1.166Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      <motion.path
        {...animate(isInView, 1, 0.8)}
        d='M117.101 43.748c-9.864-4.757-19.876-1.148-23.648 1.25 8.473 6.026 21.066 2.402 23.77 1.095 2.163-1.045.82-1.999-.122-2.345Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <motion.path
        {...animate(isInView, 1.2, 0.8)}
        d='M116.999 27.14c-11.594 2.92-16.019 8.391-16.782 10.761 7.911 1.932 14.722-5.474 16.658-8.212 1.549-2.191.729-2.612.124-2.548Z'
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
