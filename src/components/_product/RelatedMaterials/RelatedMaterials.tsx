import Markdown from '@/components/ui/markdown';
import ProductCard from '@/components/ui/ProductCard';

import styles from './RelatedMaterials.module.scss';
import type { RelatedMaterialsTypes } from './RelatedMaterials.types';

const RelatedMaterials = ({ heading, paragraph, materialRef }: RelatedMaterialsTypes) => {
  console.log(materialRef);

  return (
    <div className={styles['RelatedMaterials']}>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown>{paragraph}</Markdown>
      </header>
      <ProductCard
        desktopHorizontal
        data={materialRef}
      />
    </div>
  );
};

export default RelatedMaterials;
