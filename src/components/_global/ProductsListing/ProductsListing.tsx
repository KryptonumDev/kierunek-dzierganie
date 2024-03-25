import ProductCard from '@/components/ui/ProductCard';
import styles from './ProductsListing.module.scss';
import type { ProductsListingTypes } from './ProductsListing.types';
// import Pagination from '@/components/ui/Pagination';

const ProductsListing = ({ products }: ProductsListingTypes) => {
  return (
    <section id='produkty' className={styles['ProductsListing']}>
      {/* filters */}
      <div className={styles['grid']}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            data={product}
          />
        ))}
      </div>
      {/* <Pagination
        selectedNumber={1}
        numberOfElements={100}
        elementsDivider={10}
        pathPrefix={'/dzierganie-na-drutach'}
        urlID='#produkty'
        isCategoryPagination={false}
      /> */}
    </section>
  );
};

export default ProductsListing;
