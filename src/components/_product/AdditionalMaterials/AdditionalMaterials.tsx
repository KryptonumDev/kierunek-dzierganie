import Markdown from '@/components/ui/markdown';
import ProductCard from '@/components/ui/ProductCard';
import { getProductBasis } from '@/utils/get-product-basis';
import styles from './AdditionalMaterials.module.scss';
import type { AdditionalMaterialsTypes } from './AdditionalMaterials.types';

const AdditionalMaterials = ({ heading, additionalMaterialsList }: AdditionalMaterialsTypes) => {
  return (
    <div className={styles['AdditionalMaterials']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
      </header>
      <ul>
        {additionalMaterialsList.map((product, index) => (
          <li key={index}>
            <ProductCard
              key={product._id}
              data={product}
              basis={getProductBasis(product.basis, product._type)}
              owned={false}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdditionalMaterials;
