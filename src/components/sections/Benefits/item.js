'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const Item = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  
  return (
    <li ref={ref} data-visible={isInView}>
      {children}
    </li>
  )
}

export default Item;