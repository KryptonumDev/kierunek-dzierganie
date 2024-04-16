import ProductCard from '@/components/ui/ProductCard';
import FeaturedProductCard from '@/components/ui/FeaturedProductCard';
import styles from './ProductsListing.module.scss';
import { ListingProps } from './ProductsListing.types';

export default function Listing({ featuredProductExcerpt, products }: ListingProps) {
  return (
    <div className={styles['products']}>
      <FeaturedProductCard
        excerpt={featuredProductExcerpt}
        data={products[0]!}
      />
      <div className={styles['grid']}>
        {products.slice(1).map((product) => (
          <ProductCard
            key={product._id}
            data={product}
          />
        ))}
      </div>
    </div>
  );
}
