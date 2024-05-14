import { type ProductCard } from '@/global/types';
import styles from './Popup.module.scss';
import Item from './Item';

export default function Popup({
  data,
  closeIcon,
  setPopupState,
  popupState,
  className,
}: {
  data: ProductCard[] | undefined;
  closeIcon: React.ReactNode;
  setPopupState: (variable: boolean) => void;
  popupState: boolean;
  className: string | undefined;
}) {
  return (
    <div className={`${styles.Popup} ${className}`}>
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
          <Item
            key={i}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}
