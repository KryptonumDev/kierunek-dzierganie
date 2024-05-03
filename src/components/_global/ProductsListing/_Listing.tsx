import ProductCard from '@/components/ui/ProductCard';
import FeaturedProductCard from '@/components/ui/FeaturedProductCard';
import styles from './ProductsListing.module.scss';
import { ListingProps } from './ProductsListing.types';

export default function Listing({ featuredProductExcerpt, products, basis, ownedCourses }: ListingProps) {
  return (
    <div className={styles['products']}>
      {products.length > 0 && (
        <FeaturedProductCard
          excerpt={featuredProductExcerpt}
          data={products[0]!}
          basis={basis}
        />
      )}
      <div className={styles['grid']}>
        {products.slice(1).map((product) => (
          <ProductCard
            key={product._id}
            data={product}
            basis={basis}
            owned={ownedCourses?.includes(product._id)}
          />
        ))}
      </div>
    </div>
  );
}
