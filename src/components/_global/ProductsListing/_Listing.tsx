import ProductCard from '@/components/ui/ProductCard';
import FeaturedProductCard from '@/components/ui/FeaturedProductCard';
import styles from './ProductsListing.module.scss';
import { ListingProps } from './ProductsListing.types';

export default function Listing({
  featuredProductExcerpt,
  products,
  basis,
  ownedCourses,
  bestSeller,
  bestSellerBadge,
}: ListingProps) {
  return (
    <div className={styles['products']}>
      {bestSeller && (
        <FeaturedProductCard
          excerpt={featuredProductExcerpt}
          data={bestSeller}
          badge={bestSellerBadge}
          basis={basis}
        />
      )}
      <div className={styles['grid']}>
        {products.map((product) => (
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
