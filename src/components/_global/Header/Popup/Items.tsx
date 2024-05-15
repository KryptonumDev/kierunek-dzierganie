import { type ProductCard } from '@/global/types';
import Item from './Item';

export default function Items({
  materials_link,
  printed_manual,
  setShowCart,
  setPopupState,
}: ProductCard & { setShowCart: (variable: boolean) => void; setPopupState: (variable: boolean) => void }) {
  return (
    <>
      {materials_link && (
        <Item
          {...materials_link}
          setShowCart={setShowCart}
          setPopupState={setPopupState}
        />
      )}
      {printed_manual && (
        <Item
        {...printed_manual}
        setShowCart={setShowCart}
        setPopupState={setPopupState}
        />
      )}
    </>
  );
}
