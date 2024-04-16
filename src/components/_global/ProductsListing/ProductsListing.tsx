import ProductCard from '@/components/ui/ProductCard';
import styles from './ProductsListing.module.scss';
import type { ProductsListingTypes } from './ProductsListing.types';
import Filters from './_Filters';
import Pagination from './_Pagination';

const ProductsListing = ({
  title,
  text,
  products,
  categories,
  basis,
  courses,
  productsTotalCount,
  authors
}: ProductsListingTypes) => {

  return (
    <section
      id='produkty'
      className={styles['ProductsListing']}
    >
      {title}
      {text}
      <Filters
        courses={courses}
        basis={basis}
        categories={categories}
        authors={authors}
      />
      <div className={styles['grid']}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            data={product}
          />
        ))}
      </div>
      {/* TODO: Change no items text */}
      {products.length === 0 && <h2>Niestety teraz w tym rozdziale nic niema :( </h2>}
      {productsTotalCount > 10 && (
        <Pagination
          basis={basis}
          allElementsCount={productsTotalCount}
          elementsPerPage={10}
        />
      )}
    </section>
  );
};

export default ProductsListing;
