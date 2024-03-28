import { useRef, useState } from 'react';
import styles from './PickQuantity.module.scss';
import type { PickQuantityTypes } from './PickQuantity.types';

const PickQuantity = ({ defaultValue, ...props }: PickQuantityTypes) => {
  const [quantity, setQuantity] = useState(defaultValue || 1);
  const input = useRef<HTMLInputElement>(null);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <div className={styles['PickQuantity']}>
      <p>Ilość</p>
      <button onClick={handleDecrease}>
        <ReduceIcon />
      </button>
      <input
        ref={input}
        type='number'
        onWheel={(e) => e.currentTarget.blur()}
        value={quantity}
        {...props}
      />
      <button onClick={handleIncrease}>
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
