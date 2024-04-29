import { useRef, useState } from 'react';
import styles from './PickQuantity.module.scss';
import type { PickQuantityTypes } from './PickQuantity.types';

const PickQuantity = ({ defaultValue, change, ...props }: PickQuantityTypes) => {
  const [quantity, setQuantity] = useState(defaultValue || 1);
  const input = useRef<HTMLInputElement>(null);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;

      if (newQuantity > props.max) return props.max as number;

      change(newQuantity);
      return newQuantity;
    });
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      change(quantity);
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity - 1;

        change(newQuantity);
        return newQuantity;
      });
    }
  };

  return (
    <div className={styles['PickQuantity']}>
      <p>Ilość</p>
      <button
        disabled={quantity <= 1}
        onClick={handleDecrease}
      >
        <ReduceIcon />
      </button>
      <input
        disabled={true}
        ref={input}
        type='number'
        onWheel={(e) => e.currentTarget.blur()}
        value={quantity}
        {...props}
      />
      <button
        disabled={quantity >= props.max}
        onClick={handleIncrease}
      >
        <IncreaseIcon />
      </button>
    </div>
  );
};

export default PickQuantity;

const ReduceIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={13}
    height={2}
    fill='none'
  >
    <path
      d='M12.25.767H1'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const IncreaseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={13}
    height={13}
    fill='none'
  >
    <path
      d='M6.875 1.267v11m5.625-5.5H1.25'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
