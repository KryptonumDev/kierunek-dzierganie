import ProductCard from '@/components/ui/ProductCard';
import styles from './RelatedMaterials.module.scss';
import type { RelatedMaterialsTypes } from './RelatedMaterials.types';

const RelatedMaterials = ({ data }: RelatedMaterialsTypes) => {
  let basis = '';

  if (data.basis === 'crocheting') {
    if (data._type === 'product') basis = '/produkty-do-szydelkowania';
    else basis = '/kursy-szydelkowania';
  } else if (data.basis === 'knitting') {
    if (data._type === 'product') basis = '/produkty-do-dziergania';
    else basis = '/kursy-dziergania-na-drutach';
  }

  return (
    <section className={styles['RelatedMaterials']}>
      <div>
        <h2>Potrzebujesz materiałów?</h2>
        <p>
          <strong>Kup pakiet</strong> i miej pod ręką wszystko, czego potrzebujesz do ukończenia kursu
        </p>
      </div>
      <ProductCard
        data={data}
        desktopHorizontal={true}
        basis={basis}
      />
    </section>
  );
};

export default RelatedMaterials;
