import ProductCard from '@/components/ui/ProductCard';
import styles from './PrintedManual.module.scss';
import type { PrintedManualTypes } from './PrintedManual.types';

const PrintedManual = ({ data }: PrintedManualTypes) => {
  let basis = '';

  if (data.basis === 'crocheting') {
    if (data._type === 'product') basis = '/produkty-do-szydelkowania';
    else basis = '/kursy-szydelkowania';
  } else if (data.basis === 'knitting') {
    if (data._type === 'product') basis = '/produkty-do-dziergania';
    else basis = '/kursy-dziergania-na-drutach';
  }
  
  return (
    <section className={styles['PrintedManual']}>
      <div>
        <h2>
          <strong>Czy wiesz, że?</strong>
        </h2>
        <p>W każdej chwili możesz dokupić drukowaną instrukcję do kursu. Dostarczymy ją prosto pod Twoje drzwi!</p>
      </div>
      <ProductCard
        data={data}
        desktopHorizontal={true}
        basis={basis}
      />
    </section>
  );
};

export default PrintedManual;
