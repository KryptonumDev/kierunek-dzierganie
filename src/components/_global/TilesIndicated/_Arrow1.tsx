'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASING } from '@/global/constants';

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
    ease: EASING,
  },
});

export const Arrow1 = ({ ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '0px 34px 0px 0px', once: true });

  return (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0.5 28.5 280.17 223.96'
      stroke='#B4A29C'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <motion.path
        {...animate(isInView)}
        d='M269.672 79.582c-19.333 39.333-88.8 104.4-212 50-154-68 54.799-147.982 53.5-65.5-1.039 65.986-56.433 152.494-84 187.5'
      />
      <motion.path
        {...animate(isInView, 0.4)}
        d='M257.547 98.957c7.583 3.125 22.725 6.925 22.625-2.875-.1-9.8-15.125-2.167-22.625 2.875Z'
      />
      <motion.path
        {...animate(isInView, 0.5)}
        d='M236.261 119.311c-3.437-8.013-8.52-23.847-1.36-23.08 7.16.766 3.89 15.706 1.36 23.08Z'
      />
      <motion.path
        {...animate(isInView, 0.6)}
        d='M211.297 136.208c5.583 5.833 18.4 15.5 25 7.5 6.6-8-13.917-8.333-25-7.5Z'
      />
      <motion.path
        {...animate(isInView, .7)}
        d='M194.863 142.696c-3.333-4.948-8.471-16.297-2.357-22.113 6.113-5.816 4.118 12.319 2.357 22.113Z'
      />
      <motion.path
        {...animate(isInView, 1.2)}
        d='M27.234 251.607c4.667.834 15.5.7 21.5-6.5'
      />
      <motion.path
        {...animate(isInView, 1.2)}
        d='M26.577 251.279c-.614-4.701.025-15.516 7.497-21.174'
      />
    </svg>
  );
};
