import ProductCard from '@/components/ui/ProductCard';
import { productUrls } from '@/global/constants';
import { type ItemsType } from './items.types';

export default function Items({ materials_link, printed_manual, setShowCart, setPopupState }: ItemsType) {
  const onClick = () => {
    setShowCart(false);
    setPopupState(false);
  };

  return (
    <>
      {materials_link && (
        <ProductCard
          data={materials_link}
          basis={`${productUrls[materials_link.basis]}`}
          onClick={onClick}
          tabletHorizontal={true}
          desktopHorizontal={true}
        />
      )}
      {printed_manual && (
        <ProductCard
          data={printed_manual}
          basis={`${productUrls[printed_manual.basis]}`}
          onClick={onClick}
          tabletHorizontal={false}
          desktopHorizontal={true}
        />
      )}
    </>
  );
}
