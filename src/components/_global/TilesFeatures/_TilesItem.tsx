'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function TilesItem({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });

  return (
    <div {...props} ref={ref} data-visible={isInView}>
      {children}
    </div>
  );
}