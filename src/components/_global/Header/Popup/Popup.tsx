import { type ProductCard } from '@/global/types';
import styles from './Popup.module.scss';
import Items from './Items';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function Popup({
  data,
  closeIcon,
  setPopupState,
  popupState,
  className,
  setShowCart,
}: {
  data: ProductCard[] | null;
  closeIcon: React.ReactNode;
  setPopupState: (variable: boolean) => void;
  popupState: boolean;
  className: string | undefined;
  setShowCart: (variable: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setPopupState(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setPopupState]);
  return (
    <div
      className={`${styles.Popup} ${className}`}
      ref={ref}
    >
      <button
        className={styles.closeButton}
        onClick={() => setPopupState(!popupState)}
      >
        {closeIcon}
      </button>
      <h2>Potrzebujesz materiałów?</h2>
      <p>
        <strong>Kup pakiet</strong> i miej pod ręką wszystko czego potrzebujesz do ukończenia kursu
      </p>
      <div className={styles.items}>
        {data?.map((item, i) => (
          <Items
            setShowCart={setShowCart}
            setPopupState={setPopupState}
            key={i}
            {...(item as unknown as ProductCard[] | null)}
          />
        ))}
      </div>
    </div>
  );
}
