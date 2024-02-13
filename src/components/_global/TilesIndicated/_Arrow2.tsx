'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { easing } from '@/global/constants';

const animate = (isInView: boolean, delay?: number) => ({
  initial: {
    pathLength: 0,
  },
  animate: {
    pathLength: isInView ? 1 : 0,
  },
  transition: {
    duration: 1.3,
    delay: delay,
    ease: easing,
  },
});

export const Arrow2 = ({ ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '0px 0px -34px 0px', once: true });

  return (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='4.75 0.9 183.85 192.44'
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <motion.path
        {...animate(isInView)}
        d='M6.863 8.81C14.705 47.66 76.951 86.39 143.25 73.56c73.741-14.273 40.75-64.75 12.25-70.75-16.931-5.882-60.952 6.16-71.645 46.366-10.693 40.207 36.656 78.899 61.429 100.642 16.062 14.098 37.492-2.667 32.216-15.509-13.25-32.25-56.176 27.809-18.75 57.75'
      />
      <motion.path
        {...animate(isInView, 0.4)}
        d='M15.072 26.448c-1.115-3.68-.434-11.995 11.209-15.827.746 4.078-.452 12.953-11.209 15.827Z'
      />
      <motion.path
        {...animate(isInView, 0.5)}
        d='M27.305 43.078c-3.342-3.208-12.431-8.234-22.055-2.673 1.827 4.143 8.795 10.48 22.055 2.673Z'
      />
      <motion.path
        {...animate(isInView, 0.6)}
        d='M39.91 52.035c-1.738-4.722-2.487-14.65 8.42-16.574 1.292 3.564 1.417 11.87-8.42 16.574Z'
      />
      <motion.path
        {...animate(isInView, 0.7)}
        d='M55.153 61.654c-3.595-.792-12-.279-16.863 8.112 3.684 1.491 12.214 1.957 16.863-8.112Z'
      />
      <motion.path
        {...animate(isInView, 1.2)}
        d='M140.727 182.63c2.799 5.461 8.424 10.414 18.679 10.131'
      />
      <motion.path
        {...animate(isInView, 1.2)}
        d='M156.285 177.633c3.234 3.109 5.517 8.088 3.162 15.207'
      />
    </svg>
  );
};
