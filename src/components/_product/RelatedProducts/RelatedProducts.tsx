import styles from './RelatedProducts.module.scss';
import type { RelatedProductsTypes } from './RelatedProducts.types';
import Card from '@/components/ui/ProductCard';

const RelatedProducts = async ({ relatedCourses, title, text }: RelatedProductsTypes) => {
  if (!relatedCourses?.length) return null;

  return (
    <section className={styles['RelatedProducts']}>
      <h2
        className={styles['title']}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p
        className={styles['text']}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <div className={styles['grid']}>
        {relatedCourses.map((course) => (
          <Card
            key={course._id}
            data={course}
            tabletHorizontal={true}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
