import Markdown from '@/components/ui/markdown';
import ProductCard from '@/components/ui/ProductCard';
import styles from './AdditionalMaterials.module.scss';
import type { AdditionalMaterialsTypes } from './AdditionalMaterials.types';

const AdditionalMaterials = ({ heading, additionalMaterialsList }: AdditionalMaterialsTypes) => {
  console.log(additionalMaterialsList);
  return (
    <div className={styles['AdditionalMaterials']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      <ul>
        {additionalMaterialsList.map((product, index) => (
          <li key={index}>
            {' '}
            <ProductCard
              key={product._id}
              data={product}
              basis={product.basis === 'knitting' ? '/produkty-do-dziergania' : '/produkty-do-szydelkowania'}
              owned={false}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdditionalMaterials;
